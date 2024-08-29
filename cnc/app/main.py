import asyncio
import aiohttp
from config import ConfigObject
from cnc import CNCDataGenerator
from publish import PublishPayload

def main():
    # Set up configuration values
    configObject = ConfigObject()
    config = configObject.get_config()
    
    #Log messages.
    print(f"Simulation of CNC machine data capture started.")
    print(f"Frequency: {config['frequency']}")
    print(f"Total hours: {config['total_hours']}")
    print(f"Max abnormal duration percent: {config['max_abnormal_duration_percent']}")
    print(f"Max abnormal data percent: {config['max_abnormal_data_percent']}")
    print(f"Band: {config['band']}")
    print(f"API endpoint: {config['api_endpoint']}")
    print(f"Timezone: {config['tz']}")
    print(f"Publishing messages now.")
    
    # Create objects for publish and cnc
    cnc_generator = CNCDataGenerator(frequency=config['frequency'], 
                                     total_hours=config['total_hours'], 
                                     max_abnormal_duration_percent=config['max_abnormal_data_percent'], 
                                     max_abnormal_data_percent=config['max_abnormal_data_percent'], 
                                     band=config['band'],
                                     tz=config['tz'])
    print(cnc_generator.get_baseline_min_max())
    publish_payload = PublishPayload(config['api_endpoint'])
    
    # Publish to HTTP endpoint in an infinite loop
    async def publish_loop():
        while True:
            try:
                payload = cnc_generator.generate_next_row()
                await publish_payload._publish_to_endpoint(payload)
                await asyncio.sleep(config['frequency']/1000)
                print(payload['meta']['id'])
            except StopIteration as s:
                print(s)
                break
            except aiohttp.ClientError as a:
                print(a)
                break
            except Exception as e:
                print(e)
                break

    asyncio.run(publish_loop())

if __name__ == "__main__":
    main()
