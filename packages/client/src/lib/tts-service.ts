// ──────────────────────────────────────────────
// TTS Service — Server-proxied audio playback
// ──────────────────────────────────────────────

export type TTSState = "idle" | "loading" | "playing" | "error";

type StateListener = (state: TTSState, activeId: string | null) => void;

class TTSService {
  private audio: HTMLAudioElement | null = null;
  private currentObjectUrl: string | null = null;
  private abortController: AbortController | null = null;
  private state: TTSState = "idle";
  /** ID of the entity (e.g. message id) currently being spoken */
  private activeId: string | null = null;
  private listeners = new Set<StateListener>();

  // ── Listeners ─────────────────────────────────

  subscribe(fn: StateListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  getState(): TTSState {
    return this.state;
  }

  getActiveId(): string | null {
    return this.activeId;
  }

  private setState(s: TTSState, id: string | null = this.activeId) {
    this.state = s;
    this.activeId = s === "idle" || s === "error" ? null : id;
    this.listeners.forEach((fn) => fn(this.state, this.activeId));
  }

  // ── Playback ──────────────────────────────────

  /** Speak the given text. `id` is an optional caller-supplied key (e.g. message id) so callers can track which item is active. */
  async speak(text: string, id?: string): Promise<void> {
    this.stop();

    this.setState("loading", id ?? null);
    this.abortController = new AbortController();

    let res: Response;
    try {
      res = await fetch("/api/tts/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: this.abortController.signal,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        this.setState("idle");
        return;
      }
      this.setState("error");
      return;
    }

    if (!res.ok) {
      this.setState("error");
      return;
    }

    let blob: Blob;
    try {
      blob = await res.blob();
    } catch {
      this.setState("error");
      return;
    }

    const objectUrl = URL.createObjectURL(blob);
    this.currentObjectUrl = objectUrl;

    const audio = new Audio(objectUrl);
    this.audio = audio;

    audio.onended = () => {
      this.cleanup();
      this.setState("idle");
    };
    audio.onerror = () => {
      this.cleanup();
      this.setState("error");
    };

    this.setState("playing");
    audio.play().catch(() => {
      this.cleanup();
      this.setState("error");
    });
  }

  /** Stop any in-progress fetch or playback. */
  stop(): void {
    this.abortController?.abort();
    this.abortController = null;

    if (this.audio) {
      this.audio.pause();
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio = null;
    }

    this.cleanup();
    this.setState("idle");
  }

  private cleanup(): void {
    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
  }
}

export const ttsService = new TTSService();
