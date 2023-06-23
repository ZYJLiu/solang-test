import "../utils/counter.sol";
import "solana";

@program_id("7FWiaEs5nGW8hnHcnFNoNkZGEXLiHHzh29fZZLzEBqsh")
contract solang {
    bool private isInitialzed;
    bool private value = true;
    uint32 private number = 0;
    address private creator;

    event Flipped(bool newValue);

    @payer(payer)
    @seed("seed")
    @seed(abi.encode(payer))
    @bump(bump)
    constructor(address payer, bytes1 bump) {
        require(!isInitialzed, "Already initialized");
        isInitialzed = true;
        creator = payer;
        print("Payer address: {:}".format(payer));
        print("Number: {:}".format(number));
        print("Value: {:}".format(value));
    }

    function flip() public {
        value = !value;
        print("Flip");
        print("Creator address: {:}".format(creator));
        print("Number: {:}".format(number));
        print("Value: {:}".format(value));
        emit Flipped(value);
    }

    function increment() public {
        number += 1;
        print("Creator address: {:}".format(creator));
        print("Number: {:}".format(number));
        print("Value: {:}".format(value));
    }

    function flip_and_increment() public {
        flip();
        increment();
    }

    function get() public view returns (bool) {
        return value;
    }

    function cpi(address c, address u) public  {
        AccountMeta[2] am = [
            AccountMeta({pubkey: c, is_writable: true, is_signer: false}),
            AccountMeta({pubkey: u, is_writable: true, is_signer: true})
        ];
        counter.increment{accounts: am}();
    }
}


