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

    namespace ClassDef {
        class BankAccount{
            +String owner
            +BigDecimal balance
            +deposit(amount) bool
            +withdrawal(amount) int
        }
    }

    %% Defining Relationship
    namespace Relationship {
        class RelA
        class RelB
        class RelC
        class RelD
        class RelE
        class RelF
        class RelG
        class RelH
        class RelI
        class RelJ
        class RelK
        class RelL
        class RelM
        class RelN
        class RelO
        class RelP
    }
    RelA <|-- RelB : Inheritance
    RelC *--  RelD : Composition
    RelE o--  RelF : Aggregation
    RelG <--  RelH : Association
    RelI --   RelJ : Link (Solid)
    RelK <..  RelL : Dependency
    RelM <|.. RelN : Realization
    RelO ..   RelP : Link (Dashed)
`

export const erDiagramInstruction = dedent`
---
title: Order example
---
erDiagram
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
    %% Node shapes
    Shape_1(This is the text in the box)
    Shape_2([This is the text in the box])
    Shape_3[[This is the text in the box]]
    Shape_4[(Database)]
    Shape_5((This is the text in the circle))
    Shape_6>This is the text in the box]
    Shape_7{This is the text in the box}
    Shape_8{{This is the text in the box}}
    Shape_9[/This is the text in the box/]
    Shape_10[\This is the text in the box\]
    Shape_11[/Christmas\\\]
    Shape_12[\\\Go shopping/]
    Shape_13(((This is the text in the circle)))

    %% Links between nodes
    L_1a --> L_1b
    L_2a --- L_2b
    L_3a -- This is the text! --- L_3b
    L_4a ---|This is the text| L_4b
    L_5a -->|text| L_5b
    L_6a -- text --> L_6b
    L_7a -.-> L_7b;
    L_8a -. text .-> L_8b
    L_9a ==> L_9b
    L_10a == text ==> L_10b
    L_11a ~~~ L_11b
    L_12a & L_12b --> L_12c & L12d

    %% Subgraphs
    c1-->a2
    subgraph one
    a1-->a2
    end
    subgraph two
    b1-->b2
    end
    subgraph three
    c1-->c2
    end
`

export const sequenceInstruction = dedent`
sequenceDiagram
    actor Alice
    actor Bob
    Alice->>Bob: Hi Bob
    Bob->>Alice: Hi Alice

    participant A as Alice
    participant J as John
    A->>J: Hello John, how are you?
    J->>A: Great!
`

export const timelineInstruction = dedent`
timeline
    title Timeline of Industrial Revolution
    section basic
        2002 : LinkedIn
        2004 : Facebook
             : Google
        2005 : Youtube
        2006 : Twitter
    section 17th-20th century
        Industry 1.0 : Machinery, Water power, Steam <br>power
        Industry 2.0 : Electricity, Internal combustion engine, Mass production
        Industry 3.0 : Electronics, Computers, Automation
    section 21st century
        Industry 4.0 : Internet, Robotics, Internet of Things
        Industry 5.0 : Artificial intelligence, Big data,3D printing
`

export const zenumlInstruction = dedent`
zenuml
    title Annotators
    @Actor Alice
    @Database Bob
    Alice->Bob: Hi Bob
    Bob->Alice: Hi Alice

    A->J: Hello John, how are you?
    J->A: Great!

    A.SyncMessage
    A.SyncMessage(with, parameters) {
      B.nestedSyncMessage()
    }

    Alice->Bob: How are you?

    new A1
    new A2(with, parameters)

    // 1. assign a variable from a sync message.
    a = A.SyncMessage()

    // 1.1. optionally give the variable a type
    SomeType a = A.SyncMessage()

    // 2. use return keyword
    A.SyncMessage() {
      return result
    }

    // 3. use @return or @reply annotator on an async message
    @return
    A->B: result

    Client->A.method() {
      B.method() {
        if(condition) {
          return x1
          // return early
          @return
          A->Client: x11
        }
      }
      return x2
    }

    A.method() {
      B.nested_sync_method()
      B->C: nested async message
    }
`
