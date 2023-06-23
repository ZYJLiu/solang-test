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
      name: "get"
      docs: ["notice: Simply returns the current value of our `bool`."]
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
  metadata: {
    address: "5jkbKtTNFF5crf3ASmVkAuZQGT7WAuLdumrzUCH3MscG"
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
      name: "get",
      docs: ["notice: Simply returns the current value of our `bool`."],
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
  metadata: {
    address: "5jkbKtTNFF5crf3ASmVkAuZQGT7WAuLdumrzUCH3MscG",
  },
}
