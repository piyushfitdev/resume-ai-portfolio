import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv
from models import Prompt
from groq import Groq
from pydantic import BaseModel,Field
import time

#---------------------------------Loading Model---------------------------------
load_dotenv()
my_api_key=os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("API key kaha hai bhai")

client=Groq(api_key=my_api_key)
model="llama-3.3-70b-versatile"

#-------------------------------Load---------------------------------------
BASE_DIR = Path(__file__).resolve().parent

#-------------------------------Load Resume---------------------------------------
RESUME_PATH = BASE_DIR / "data" / "resume.txt"
resume = RESUME_PATH.read_text(encoding="utf-8")


#-------------------------------Load System Prompt---------------------------------------
prompt_path = BASE_DIR / "prompts" / "system_prompt.txt"
prompt_template = prompt_path.read_text(encoding="utf-8")

system_prompt = prompt_template.replace("{resume}", resume)


#------------------------------------------------------------------------------------------
def answer(prompt:str):
    message_user={
        "role":"system",
        "content":system_prompt
    }



    message={
        "role":"user",
        "content":prompt
    }
    messages=[message_user,message]
    stream=client.chat.completions.create(model=model,messages=messages,stream=True)

    for chunk in stream:
        content = chunk.choices[0].delta.content

        if content:
            yield content
     
    # response1=client.chat.completions.create(model=model,messages=messages)
    # answer=response1.choices[0].message.content
    # return answer



# stream=client.chat.completions.create(model=model,messages=messages,stream=True)
# for chunk in stream:
#     content =chunk.choices[0].delta.content
#     if content:
#         print(content,end="",flush=True) # flush= true means turant print karo