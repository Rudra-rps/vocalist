from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Iterable, List
import math

from smart_dj_engine import SmartDJEngine, SensorFrame


@dataclass(frozen=True)
class DemoScenario:
    key: str
    title: str
    description: str
    base_distance: int
    distance_wave: int
    base_sound: int
    sound_wave: int
    crowd_pulse: int
    sound_pulse: int


SCENARIOS: Dict[str, DemoScenario] = {
    "warmup_room": DemoScenario(
        key="warmup_room",
        title="Warmup Room",
        description="Light crowd, moderate movement, music building slowly.",
        base_distance=1350,
        distance_wave=220,
        base_sound=650,
        sound_wave=260,
        crowd_pulse=90,
        sound_pulse=200,
    ),
    "crowd_surge": DemoScenario(
        key="crowd_surge",
        title="Crowd Surge",
        description="People move closer to the booth in waves.",
        base_distance=720,
        distance_wave=320,
        base_sound=1200,
        sound_wave=500,
        crowd_pulse=220,
        sound_pulse=380,
    ),
    "peak_hour": DemoScenario(
        key="peak_hour",
        title="Peak Hour",
        description="Strong density and energy with regular hype moments.",
        base_distance=380,
        distance_wave=150,
        base_sound=2200,
        sound_wave=760,
        crowd_pulse=120,
        sound_pulse=650,
    ),
    "too_loud_alert": DemoScenario(
        key="too_loud_alert",
        title="Too Loud Alert",
        description="The room is hot, but the sound occasionally crosses the safe limit.",
        base_distance=300,
        distance_wave=80,
        base_sound=2900,
        sound_wave=820,
        crowd_pulse=60,
        sound_pulse=900,
    ),
    "late_night_dip": DemoScenario(
        key="late_night_dip",
        title="Late Night Dip",
        description="The floor is thinning out and energy fades after the peak.",
        base_distance=1500,
        distance_wave=280,
        base_sound=540,
        sound_wave=180,
        crowd_pulse=70,
        sound_pulse=130,
    ),
}


def list_scenarios() -> List[DemoScenario]:
    return list(SCENARIOS.values())


def _wave(tick: int, size: int, period: float, phase: float = 0.0) -> int:
    return int(round(math.sin((tick / period) + phase) * size))


def _pulse(tick: int, every: int, size: int) -> int:
    return size if every > 0 and tick % every == 0 else 0


class DemoRunner:
    def __init__(self, scenario_key: str) -> None:
        if scenario_key not in SCENARIOS:
            raise KeyError(f"Unknown scenario: {scenario_key}")
        self.scenario = SCENARIOS[scenario_key]
        self.engine = SmartDJEngine()

    def frame_at(self, tick: int) -> SensorFrame:
        s = self.scenario
        distance = (
            s.base_distance
            + _wave(tick, s.distance_wave, 4.6)
            - _pulse(tick, 7, s.crowd_pulse)
        )
        sound = (
            s.base_sound
            + _wave(tick, s.sound_wave, 3.4, 0.7)
            + _pulse(tick, 5, s.sound_pulse)
        )
        distance = max(80, distance)
        sound = max(120, sound)
        return self.engine.process(
            distance_mm=distance,
            raw_sound_level=sound,
            mode="DEMO",
            scenario=s.key,
            tick=tick,
        )

    def frames(self, ticks: int) -> Iterable[SensorFrame]:
        for tick in range(ticks):
            yield self.frame_at(tick)

