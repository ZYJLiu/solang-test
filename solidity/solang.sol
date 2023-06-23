
@program_id("5jkbKtTNFF5crf3ASmVkAuZQGT7WAuLdumrzUCH3MscG")
contract solang {
    bool private value = true;

    @payer(payer)
    @seed("seed")
    @seed(abi.encode(payer))
    @bump(bump)
    constructor(address payer, bytes1 bump) {
        print("Payer address: {:}".format(payer));
        print("Value: {:}".format(value));
        flip();
    }

    /// A message that can be called on instantiated contracts.
    /// This one flips the value of the stored `bool` from `true`
    /// to `false` and vice versa.
    function flip() public {
            value = !value;
            print("Flip");
            print("Value: {:}".format(value));
    }

    /// Simply returns the current value of our `bool`.
    function get() public view returns (bool) {
            return value;
    }
}
