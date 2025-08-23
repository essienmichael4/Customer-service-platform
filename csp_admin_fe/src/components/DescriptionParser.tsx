import parse from 'html-react-parser'
interface DescriptionParserProps {
    description:string
}

const DescriptionParser = ({description}:DescriptionParserProps) => {
  return (
    <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none">
        {parse(description)}
    </div>
  )
}

export default DescriptionParser
