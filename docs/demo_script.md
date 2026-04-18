# Demo Script

## Goal

Show that Smart DJ Booth can still communicate booth intelligence even when the physical sensing stack is temporarily unavailable.

## Suggested Flow

1. Start with `warmup_room`.
   Explain that the system is reading low energy and light density.
2. Switch to `crowd_surge`.
   Show density rising as people move toward the booth.
3. Switch to `peak_hour`.
   Show the system entering a `HYPE` state.
4. Switch to `too_loud_alert`.
   Explain that the system can detect when the room crosses a safe sound threshold.
5. Finish with `late_night_dip`.
   Show how the state settles back down.

## Presenter Line

"Even with the hardware layer temporarily offline, we built the project so the sensing logic, state engine, and demo experience stay intact. Once the sensors are back, the same output contract feeds the live version."

