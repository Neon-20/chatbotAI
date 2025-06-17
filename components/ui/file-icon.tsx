import {
  IconFile,
  IconFileText,
  IconFileTypeCsv,
  IconFileTypeDocx,
  IconFileTypePdf,
  IconFileTypeJs,
  IconFileTypeTs,
  IconFileTypeHtml,
  IconFileTypeCss,
  IconFileTypePhp,
  IconJson,
  IconMarkdown,
  IconPhoto,
  IconBrandPython,
  IconBrandCSharp
} from "@tabler/icons-react"
import { FC } from "react"

interface FileIconProps {
  type: string
  size?: number
}

export const FileIcon: FC<FileIconProps> = ({ type, size = 32 }) => {
  if (type.includes("image")) {
    return <IconPhoto size={size} />
  } else if (type.includes("pdf")) {
    return <IconFileTypePdf size={size} />
  } else if (type.includes("csv")) {
    return <IconFileTypeCsv size={size} />
  } else if (type.includes("docx")) {
    return <IconFileTypeDocx size={size} />
  } else if (type.includes("plain")) {
    return <IconFileText size={size} />
  } else if (type.includes("json")) {
    return <IconJson size={size} />
  } else if (type.includes("markdown")) {
    return <IconMarkdown size={size} />
  } else if (type === "js") {
    return <IconFileTypeJs size={size} />
  } else if (type === "ts") {
    return <IconFileTypeTs size={size} />
  } else if (type === "tsx") {
    return <IconFileTypeTs size={size} />
  } else if (type === "py") {
    return <IconBrandPython size={size} />
  } else if (type === "jsx") {
    return <IconFileTypeJs size={size} />
  } else if (type === "html") {
    return <IconFileTypeHtml size={size} />
  } else if (type === "css") {
    return <IconFileTypeCss size={size} />
  } else if (type === "php") {
    return <IconFileTypePhp size={size} />
  } else if (type === "cs") {
    return <IconBrandCSharp size={size} />
  } else if (type === "md") {
    return <IconMarkdown size={size} />
  } else if (type === "mdx") {
    return <IconMarkdown size={size} />
  } else {
    return <IconFile size={size} />
  }
}
