import HtmlContent from "./HtmlContent"

const Emphasis = ({ children }) => {
  console.log(children)
  return <HtmlContent html={
    String(children).replace(
      /\*(.*?)\*/g,
      '<span class="text-secondary">$1</span>'
    )} />
}

export default Emphasis