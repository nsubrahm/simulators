import uuid
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json
import pytz

class CNCDataGenerator:
    def __init__(self, frequency=1000, total_hours=720, max_abnormal_duration_percent=0.1, max_abnormal_data_percent=20, band=0.9, tz="Asia/Kolkata"):
        self.frequency = int(round(frequency/1000,0))
        self.total_hours = total_hours
        self.max_abnormal_duration_percent = max_abnormal_duration_percent
        self.max_abnormal_data_percent = max_abnormal_data_percent
        self.band = band
        
        self.timezone = pytz.timezone(tz)
        self.start_time = datetime.now(self.timezone)
        self.current_time = self.start_time
        self.end_time = self.start_time + timedelta(hours=total_hours)
        self.total_rows = int(total_hours * 3600 // self.frequency)
        self.abnormal_event_indices = self._generate_abnormal_indices()
        self.row_counter = 0
        
        # Default baseline, minima, and maxima values
        self.parameters = {
            "spindleLoad": {"baseline": 50, "min": 0, "max": 100, "unit": "%"},
            "spindleSpeed": {"baseline": 5000, "min": 0, "max": 12000, "unit": "rpm"},
            "spindleTorque": {"baseline": 5, "min": 0, "max": 50, "unit": "Nm"},
            "cuttingForce": {"baseline": 300, "min": 0, "max": 2000, "unit": "N"},
            "vibration": {"baseline": 0.5, "min": 0, "max": 5, "unit": "m/s²"},
            "spindleTemperature": {"baseline": 60, "min": -40, "max": 200, "unit": "°C"},
            "wearCompensation": {"baseline": 0.1, "min": 0, "max": 1, "unit": "mm"},
            "cycleTime": {"baseline": 60, "min": 1, "max": 3600, "unit": "s"}
        }

    def _generate_abnormal_indices(self):
        max_abnormal_rows = int((self.max_abnormal_data_percent / 100) * self.total_rows)
        max_abnormal_event_rows = int((self.max_abnormal_duration_percent / 100) * self.total_rows)
        abnormal_event_indices = np.random.choice(range(self.total_rows), size=max_abnormal_rows, replace=False)
        return {idx: min(idx + max_abnormal_event_rows, self.total_rows) for idx in abnormal_event_indices}

    def _generate_correlated_cnc_data(self, condition='normal'):
        params = self.parameters
        if condition == 'normal':
            base_load = np.random.uniform(params['spindleLoad']['min'], params['spindleLoad']['max'])
            spindle_speed = np.random.uniform(params['spindleSpeed']['min'], params['spindleSpeed']['max'])
            spindle_torque = np.random.uniform(params['spindleTorque']['min'], params['spindleTorque']['max'])
            cutting_force = np.random.uniform(params['cuttingForce']['min'], params['cuttingForce']['max'])
            vibration = np.random.uniform(params['vibration']['min'], params['vibration']['max'])
            spindleTemperature = np.random.uniform(params['spindleTemperature']['min'], params['spindleTemperature']['max'])
            wear_compensation = np.random.uniform(params['wearCompensation']['min'], params['wearCompensation']['max'])
            cycle_time = np.random.uniform(params['cycleTime']['min'], params['cycleTime']['max'])

        elif condition == 'abnormal':
            base_load = np.random.uniform(params['spindleLoad']['min'] * (1 - self.band), params['spindleLoad']['max'] * (1 + self.band))
            spindle_speed = np.random.uniform(params['spindleSpeed']['min'] * (1 - self.band), params['spindleSpeed']['max'] * (1 + self.band))
            spindle_torque = np.random.uniform(params['spindleTorque']['min'] * (1 - self.band), params['spindleTorque']['max'] * (1 + self.band))
            cutting_force = np.random.uniform(params['cuttingForce']['min'] * (1 - self.band), params['cuttingForce']['max'] * (1 + self.band))
            vibration = np.random.uniform(params['vibration']['min'] * (1 - self.band), params['vibration']['max'] * (1 + self.band))
            spindleTemperature = np.random.uniform(params['spindleTemperature']['min'] * (1 - self.band), params['spindleTemperature']['max'] * (1 + self.band))
            wear_compensation = np.random.uniform(params['wearCompensation']['min'] * (1 - self.band), params['wearCompensation']['max'] * (1 + self.band))
            cycle_time = np.random.uniform(params['cycleTime']['min'] * (1 - self.band), params['cycleTime']['max'] * (1 + self.band))

        else:
            raise ValueError("Condition must be 'normal' or 'abnormal'.")

        return {
            "spindleLoad": round(base_load, 2),
            "spindleSpeed": round(spindle_speed, 2),
            "spindleTorque": round(spindle_torque, 2),
            "cuttingForce": round(cutting_force, 2),
            "vibration": round(vibration, 2),
            "spindleTemperature": round(spindleTemperature, 2),
            "wearCompensation": round(wear_compensation, 2),
            "cycleTime": round(cycle_time, 2),
            "ts": self.current_time.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]
        }

    def generate_next_row(self):
        # Check if current time exceeds the allowed total duration
        if self.current_time >= self.end_time:
            raise StopIteration("All rows have been generated within the specified duration.")
        
        # Determine if current row should be normal or abnormal
        condition = 'normal'
        for start_idx, end_idx in self.abnormal_event_indices.items():
            if start_idx <= self.row_counter < end_idx:
                condition = 'abnormal'
                break

        # Generate data row
        row_data = self._generate_correlated_cnc_data(condition=condition)
        
        # Update time and row counter
        self.current_time += timedelta(seconds=self.frequency)
        self.row_counter += 1

        payload = self.generate_payload(row_data)
        return payload  
    
    def generate_payload(self, dataRow):
      meta = {
        "id": str(uuid.uuid4()),
        "ts": dataRow['ts'],
        "type": "data"
      }
      
      data = []
      for k, v in dataRow.items():
        if k == 'ts':
          pass
        else:
          data.append({"key": k, "value": v})
        
      payload = {
        "meta": meta,
        "data": data
      }
      
      return payload
    
    def get_baseline_min_max(self):
        data_ranges = [
            {
                "p": key,
                "b": value["baseline"],
                "n": value["min"],
                "x": value["max"],
                "l": round(value["min"] * (1 - self.band), 2),
                "h": round(value["max"] * (1 + self.band), 2),
                "u": value["unit"]
            }
            for key, value in self.parameters.items()
        ]
        return json.dumps(data_ranges)
    
    def set_parameter_range(self, parameter_name, baseline, min_value, max_value, unit):
        if parameter_name in self.parameters:
            self.parameters[parameter_name] = {
                "baseline": baseline,
                "min": min_value,
                "max": max_value,
                "unit": unit
            }
        else:
            raise ValueError(f"Parameter {parameter_name} is not recognized.")

