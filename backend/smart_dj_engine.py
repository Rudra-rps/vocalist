from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Dict


DISTANCE_NEAR_MM = 50
DISTANCE_FAR_MM = 2000
SOUND_GOOD_THRESHOLD = 1000
SOUND_HYPE_THRESHOLD = 2000
SOUND_TOO_LOUD_THRESHOLD = 3200


def clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))


def map_range(
    value: float,
    in_min: float,
    in_max: float,
    out_min: float,
    out_max: float,
) -> float:
    if in_max == in_min:
        return out_min
    ratio = (value - in_min) / (in_max - in_min)
    return out_min + ratio * (out_max - out_min)


def distance_to_density(distance_mm: int) -> int:
    constrained = clamp(distance_mm, DISTANCE_NEAR_MM, DISTANCE_FAR_MM)
    density = map_range(
        constrained,
        DISTANCE_NEAR_MM,
        DISTANCE_FAR_MM,
        100,
        0,
    )
    return int(round(clamp(density, 0, 100)))


@dataclass
class SensorFrame:
    distance_mm: int
    sound_level: int
    density: int
    state: str
    mode: str
    scenario: str
    tick: int

    def to_serial_line(self) -> str:
        fields = {
            "distance": self.distance_mm,
            "sound": self.sound_level,
            "density": self.density,
            "state": self.state,
            "mode": self.mode,
            "scenario": self.scenario,
            "tick": self.tick,
        }
        return ",".join(f"{key}={value}" for key, value in fields.items())

    def to_dict(self) -> Dict[str, object]:
        return asdict(self)


class SmartDJEngine:
    """Shared logic for both live sensor data and simulated demo data."""

    def __init__(self, mic_smoothing: float = 0.25) -> None:
        self.mic_smoothing = clamp(mic_smoothing, 0.01, 1.0)
        self._smoothed_sound = 0.0

    def smooth_sound(self, sound_level: int) -> int:
        self._smoothed_sound = (
            self.mic_smoothing * sound_level
            + (1.0 - self.mic_smoothing) * self._smoothed_sound
        )
        return int(round(self._smoothed_sound))

    def classify_state(self, density: int, sound_level: int) -> str:
        if sound_level >= SOUND_TOO_LOUD_THRESHOLD:
            return "TOO LOUD"
        if density >= 70 and sound_level >= SOUND_HYPE_THRESHOLD:
            return "HYPE"
        if sound_level >= SOUND_GOOD_THRESHOLD or density >= 55:
            return "GOOD"
        return "LOW"

    def process(
        self,
        *,
        distance_mm: int,
        raw_sound_level: int,
        mode: str,
        scenario: str,
        tick: int,
    ) -> SensorFrame:
        density = distance_to_density(distance_mm)
        smoothed_sound = self.smooth_sound(raw_sound_level)
        state = self.classify_state(density, smoothed_sound)
        return SensorFrame(
            distance_mm=distance_mm,
            sound_level=smoothed_sound,
            density=density,
            state=state,
            mode=mode,
            scenario=scenario,
            tick=tick,
        )

