export type Solang = {
  version: "0.3.0"
  name: "solang"
  instructions: [
    {
      name: "new"
      accounts: [
        {
          name: "dataAccount"
          isMut: true
          isSigner: false
          isOptional: false
        },
        {
          name: "wallet"
          isMut: false
          isSigner: true
          isOptional: false
        },
        {
          name: "systemProgram"
          isMut: false
          isSigner: false
          isOptional: false
        }
      ]
      args: [
        {
          name: "payer"
          type: "publicKey"
        },
        {
          name: "bump"
          type: {
            array: ["u8", 1]
          }
        }
      ]
    },
    {
      name: "flip"
      accounts: [
        {
          name: "dataAccount"
          isMut: true
          isSigner: false
          isOptional: false
        }
      ]
      args: []
    },
    {
      name: "increment"
      accounts: [
        {
          name: "dataAccount"
          isMut: true
          isSigner: false
          isOptional: false
        }
      ]
      args: []
    },
    {
      name: "flip_and_increment"
      accounts: [
        {
          name: "dataAccount"
          isMut: true
          isSigner: false
          isOptional: false
        }
      ]
      args: []
    },
    {
      name: "get"
      accounts: [
        {
          name: "dataAccount"
          isMut: false
          isSigner: false
          isOptional: false
        }
      ]
      args: []
      returns: "bool"
    }
  ]
  events: [
    {
      name: "Flipped"
      fields: [
        {
          name: "newValue"
          type: "bool"
          index: false
        }
      ]
    }
  ]
  metadata: {
    address: "7FWiaEs5nGW8hnHcnFNoNkZGEXLiHHzh29fZZLzEBqsh"
  }
}

export const IDL: Solang = {
  version: "0.3.0",
  name: "solang",
  instructions: [
    {
      name: "new",
      accounts: [
        {
          name: "dataAccount",
          isMut: true,
          isSigner: false,
          isOptional: false,
        },
        {
          name: "wallet",
          isMut: false,
          isSigner: true,
          isOptional: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
          isOptional: false,
        },
      ],
      args: [
        {
          name: "payer",
          type: "publicKey",
        },
        {
          name: "bump",
          type: {
            array: ["u8", 1],
          },
        },
      ],
    },
    {
      name: "flip",
      accounts: [
        {
          name: "dataAccount",
          isMut: true,
          isSigner: false,
          isOptional: false,
        },
      ],
      args: [],
    },
    {
      name: "increment",
      accounts: [
        {
          name: "dataAccount",
          isMut: true,
          isSigner: false,
          isOptional: false,
        },
      ],
      args: [],
    },
    {
      name: "flip_and_increment",
      accounts: [
        {
          name: "dataAccount",
          isMut: true,
          isSigner: false,
          isOptional: false,
        },
      ],
      args: [],
    },
    {
      name: "get",
      accounts: [
        {
          name: "dataAccount",
          isMut: false,
          isSigner: false,
          isOptional: false,
        },
      ],
      args: [],
      returns: "bool",
    },
  ],
  events: [
    {
      name: "Flipped",
      fields: [
        {
          name: "newValue",
          type: "bool",
          index: false,
        },
      ],
    },
  ],
  metadata: {
    address: "7FWiaEs5nGW8hnHcnFNoNkZGEXLiHHzh29fZZLzEBqsh",
  },
}
