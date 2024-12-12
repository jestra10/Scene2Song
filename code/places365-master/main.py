import requests
from taipy.gui import Gui, State, notify
context = "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by Google. How can I help you today? "
conversation = {
    "Conversation": ["Who are you?", "Hi! I am FLAN-T5 XXL. How can I help you today?"]
}
current_user_message = ""
API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-xxl"
headers = {"Authorization": "Bearer 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"}
def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

def request(state: State, prompt: str) -> str:
    """
    Send a prompt to the HuggingFace API and return the response.

    Args:
        - state: The current state of the app.
        - prompt: The prompt to send to the API.

    Returns:
        The response from the API.
    """
    
    output = query(
        {
            "inputs": prompt,
        }
    )
    print(output)
    return output[0]["generated_text"]
def send_message(state: State) -> None:
    """
    Send the user's message to the API and update the conversation.

    Args:
        - state: The current state of the app.
    """
    # Add the user's message to the context
    state.context += f"Human: \n {state.current_user_message}\n\n AI:"
    # Send the user's message to the API and get the response
    answer = request(state, state.context).replace("\n", "")
    # Add the response to the context for future messages
    state.context += answer
    # Update the conversation
    conv = state.conversation._dict.copy()
    conv["Conversation"] += [state.current_user_message, answer]
    state.conversation = conv
    # Clear the input field
    state.current_user_message = ""