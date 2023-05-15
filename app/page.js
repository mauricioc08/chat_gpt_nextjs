"use client";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GPT_KEY;
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textArea = useRef(null);

  useEffect(() => {
    setResponse(window.localStorage.getItem("interaction"));
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      textArea.current.scrollTop = textArea.current.scrollHeight;
    };

    scrollToBottom();
  }, [response]);

  function SendQuestion() {
    setIsLoading(true);

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
        temperature: 1, // criatividade na resposta
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

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }

  function hendlePrev(e) {
    e.preventDefault();

    if (question.trim() !== "") {
      SendQuestion();
    }
  }

  function hendleResponse(value) {
    window.localStorage.setItem("interaction", value);
    setResponse(value);

    if (value === "") {
      setQuestion("");
    }
  }

  return (
    <>
      <main className="body">
        <div className="content">
          <form onSubmit={hendlePrev}>
            <h1>Como Posso Ajudar?</h1>
            <textarea
              id="result"
              rows={18}
              disabled=""
              placeholder="Resposta do Chat"
              value={response}
              readOnly
              ref={textArea}
            />
            <input
              id="inputQuestion"
              placeholder="Pergunte algo"
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
              autoComplete="off"
            />
            <div className="button-group">
              <button id="btn" disabled={isLoading}>
                {isLoading ? "Carregando..." : "Enviar"}
              </button>
              <button onClick={() => hendleResponse("")}>
                Limpar Histórico
              </button>
            </div>
          </form>
        </div>
      </main>
      <footer>
        <p className="footer-copy">
          <a
            href="https://github.com/mauricioc08"
            target="_blank"
            rel="noreferrer"
          >
            Mauricio Cassiano
          </a>
          © Alguns direitos reservados.
        </p>
      </footer>
    </>
  );
}
