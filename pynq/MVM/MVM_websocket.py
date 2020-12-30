# Matrix-vector multiplication

# Used to show the variance in execution time latency on an embedded linux
# device as part of the Swansea emSys course.
# developed for the wonderful PYNQ device from Xilinx

# author: stf

from time import time
from numpy.random import seed
from numpy.random import rand
import asyncio
import websockets

# initialisation
res = [0.0 for x in range(15)]
rvec = rand(15)
rmat = rand(15, 15)

# websocket initialisation
async def hello():
    uri = "ws://192.168.0.102:1234"
    async with websockets.connect(uri) as websocket:
        while True:
            t0 = time()
            for i in range(15):
                res[i] = 0.0
                for j in range(15):
                    res[i] += rvec[j] * rmat[i][j]
            t1 = time()
            time_sample = "{:.4f}".format((t1 - t0)*1000.0)
            await websocket.send(time_sample)

asyncio.get_event_loop().run_until_complete(hello())

