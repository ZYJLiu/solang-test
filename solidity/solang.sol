import "../utils/counter.sol";
import "../utils/spl_token.sol";
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

    function cpi(address counter_address, address user_address) public  {
        AccountMeta[2] metas = [
            AccountMeta({pubkey: counter_address, is_writable: true, is_signer: false}),
            AccountMeta({pubkey: user_address, is_writable: true, is_signer: true})
        ];
        counter.increment{accounts: metas}();
    }

    function spl_transfer(address from, address to) public  {
        SplToken.TokenAccountData from_data = SplToken.get_token_account_data(from);
        SplToken.transfer(from, to, from_data.owner, 1);
    }
}


