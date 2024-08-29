import os

class ConfigObject:
    def __init__(self):
        self.frequency = int(os.getenv("FREQUENCY", 1000))
        self.total_hours = int(os.getenv("TOTAL_HOURS", 1))
        self.max_abnormal_duration_percent = float(os.getenv("MAX_ABNORMAL_DURATION_PERCENT", 0.1))
        self.max_abnormal_data_percent = float(os.getenv("MAX_ABNORMAL_DATA_PERCENT", 20))
        self.band = float(os.getenv("BAND", 0.9))
        self.api_endpoint = os.getenv("API_ENDPOINT", "http://localhost:8084/data")
        self.tz = os.getenv("TZ", "Asia/Kolkata")

    def get_config(self):
        return {
        "frequency": self.frequency,
        "total_hours": self.total_hours,
        "max_abnormal_duration_percent": self.max_abnormal_duration_percent,
        "max_abnormal_data_percent": self.max_abnormal_data_percent,
        "band": self.band,
        "api_endpoint": self.api_endpoint,
        "tz": self.tz
        }
