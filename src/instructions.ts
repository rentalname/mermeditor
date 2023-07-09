import dedent from "ts-dedent"

export const classDiagramInstruction = dedent`
---
title: Animal example
---
classDiagram
    note "From Duck till Zebra"
    Animal <|-- Duck
    note for Duck "can fly can swim can dive can help in debugging"
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
`

export const erDiagramInstruction = dedent`
erDiagram
---
title: Order example
---
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
`

export const flowchartInstruction = dedent`
flowchart LR
    markdown["\`This **is** _Markdown_\`"]
    newLines["\`Line1
    Line 2
    Line 3\`"]
    markdown --> newLines
`
