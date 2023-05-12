"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GPT_KEY;
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    setResponse(window.localStorage.getItem("interaction"));
  }, []);

  function SendQuestion() {
    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: question,
        max_tokens: 2048, // tamanho da resposta
        temperature: 0.8, // criatividade na resposta
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        let result = "\n";

        if (json.error?.message) {
          result += `Error: ${json.error.message}`;
        } else if (json.choices?.[0].text) {
          var text = json.choices[0].text || "Sem resposta";

          result += "Chat GPT: " + text;
          const questionName = "Eu:\n " + question + "\n ";
          const interection = questionName + result;
          const interectionRes =
            (response ? response + "\n\n" : "") + interection;
          setQuestion("");
          hendleResponse(interectionRes);
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  function hendlePrev(e) {
    SendQuestion();
    e.preventDefault();
  }

  function hendleResponse(value) {
    window.localStorage.setItem("interaction", value);
    setResponse(value);
  }

  return (
    <main className="body">
      <div className="content">
        <h1>Como Pósso Ajudar!!!</h1>
        <form onSubmit={hendlePrev}>
          <textarea
            id="result"
            rows={10}
            disabled=""
            placeholder="Resposta do Chat"
            value={response}
            readOnly
          />
          <input
            id="inputQuestion"
            placeholder="Pergunte algo"
            onChange={(e) => setQuestion(e.target.value)}
            value={question}
            autoComplete="off"
          />
          <button id="btn">Enviar</button>
        </form>
        <button
          onClick={() => {
            hendleResponse("");
          }}
        >
          Limpar Histórico
        </button>
      </div>
    </main>
  );
}
