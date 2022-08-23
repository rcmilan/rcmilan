import ReactMarkdown from "react-markdown";

interface Props {
  content: string;
}

function Markdown({ content }: Props) {
  return (
    <article className="prose">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}

export default Markdown;
