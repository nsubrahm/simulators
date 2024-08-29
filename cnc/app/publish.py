import aiohttp 

class PublishPayload:
    def __init__(self, api_endpoint):
        self.api_endpoint = api_endpoint

    async def _publish_to_endpoint(self, payload):  
        async with aiohttp.ClientSession() as session: 
            try:
                async with session.post(self.api_endpoint, json=payload) as response:
                    response.raise_for_status()
            except StopIteration:
              raise
            except aiohttp.ClientError:
              raise

