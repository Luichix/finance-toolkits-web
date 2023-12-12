import { slug } from "github-slugger";
import { marked } from "marked";
import { remark } from "remark";

// slugify
export const slugify = (content: string) => {
  if (!content) return null;

  return slug(content);
};

// markdownify
export const markdownify = (content: string) => {
  if (!content) return null;

  return marked.parseInline(content);
};

// humanize
export const humanize = (content: string) => {
  if (!content) return null;

  return content
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase();
    });
};

// plainify
export const plainify = (content: string) => {
  if (!content) return null;

  const filterBrackets = content.replace(/<\/?[^>]+(>|$)/gm, "");
  const filterSpaces = filterBrackets.replace(/[\r\n]\s*[\r\n]/gm, "");
  const stripHTML = htmlEntityDecoder(filterSpaces);
  return stripHTML;
};

// strip entities for plainify
const htmlEntityDecoder = (htmlWithEntities: string): string => {
  let entityList: { [key: string]: string } = {
    "&nbsp;": " ",
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };
  let htmlWithoutEntities: string = htmlWithEntities.replace(
    /(&amp;|&lt;|&gt;|&quot;|&#39;)/g,
    (entity: string): string => {
      return entityList[entity];
    },
  );
  return htmlWithoutEntities;
};

interface ContentRemark {
  items: string[];
  title: string;
}

export const remarkify = (body: string): Promise<ContentRemark[]> => {
  return new Promise((resolve, reject) => {
    // Estructura de datos
    const content: ContentRemark[] = [];

    // Procesar el contenido Markdown
    remark()
      .use(() => (tree: any) => {
        // Recorrer cada nodo y verificar que sea un header
        tree.children.forEach((node: any, index: number) => {
          // Si es un header revisar si el nodo hermano es un list
          if (node.type === "heading") {
            if (
              tree.children[index + 1] &&
              tree.children[index + 1].type === "list"
            ) {
              const section: ContentRemark = {
                title: node.children[0]?.value || "",
                items: tree.children[index + 1].children.map(
                  (itemNode: any) =>
                    itemNode.children[0]?.children[0].value || "", // Verificar que 'itemNode.children' existe
                ),
              };

              content.push(section);
            }
          }
        });
      })
      .process(body, (err, file) => {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      });
  });
};
