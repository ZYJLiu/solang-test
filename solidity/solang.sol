import "../utils/counter.sol";
import "../utils/spl_token.sol";
import "../utils/system_instruction.sol";
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
        require(isInitialzed != true, "Already initialized");
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

    function cpi(address counterAddress, address userAddress) public  {
        AccountMeta[2] metas = [
            AccountMeta({pubkey: counterAddress, is_writable: true, is_signer: false}),
            AccountMeta({pubkey: userAddress, is_writable: true, is_signer: true})
        ];
        counter.increment{accounts: metas}();
    }

    function spl_transfer(address from, address to) public  {
        SplToken.TokenAccountData from_data = SplToken.get_token_account_data(from);
        SplToken.transfer(from, to, from_data.owner, 1);
    }

    function initialize_mint(address payer, address mint, address mintAuthority, address freezeAuthority, uint8 decimals) public  {
        SystemInstruction.create_account(payer, mint, 1461600, 82, address"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
        SplToken.initialize_mint(mint, mintAuthority, freezeAuthority, decimals);
    }

    function initialize_mint_pda(address payer, address mint, address mintAuthority, address freezeAuthority, uint8 decimals, bytes bump) public  {
        (address pda, bytes1 pdaBump) = try_find_program_address(["mint"], address"7FWiaEs5nGW8hnHcnFNoNkZGEXLiHHzh29fZZLzEBqsh");
        require(pda == mint, "Incorrect PDA");
        require(pdaBump == bump, "Incorrect Bump");
        create_mint_account_pda(payer, mint, bump);
        SplToken.initialize_mint(mint, mintAuthority, freezeAuthority, decimals);
    }

    function create_mint_account_pda(address from, address to, bytes bump) internal view{
        AccountMeta[2] metas = [
            AccountMeta({pubkey: from, is_signer: true, is_writable: true}),
            AccountMeta({pubkey: to, is_signer: true, is_writable: true})
        ];

        bytes bincode = abi.encode(uint32(0), uint64(1461600), uint64(82), address"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

        address"11111111111111111111111111111111".call{accounts: metas, seeds: [["mint", bump]]}(bincode);
    }

    function initialize_account(address payer, address tokenAccount, address mint, address owner) public  {
        SystemInstruction.create_account(payer, tokenAccount, 2039280, 165, address"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
        SplToken.initialize_account(tokenAccount, mint, owner);
    }

    function initialize_account_pda(address payer, address tokenAccount, address mint, address owner, bytes bump) public  {
        (address pda, bytes1 pdaBump) = try_find_program_address(["token"], address"7FWiaEs5nGW8hnHcnFNoNkZGEXLiHHzh29fZZLzEBqsh");
        require(pda == tokenAccount, "Incorrect PDA");
        require(pdaBump == bump, "Incorrect Bump");
        create_token_account_pda(payer, tokenAccount, bump);
        SplToken.initialize_account(tokenAccount, mint, owner);
    }

    function create_token_account_pda(address from, address to, bytes bump) internal view{
        AccountMeta[2] metas = [
            AccountMeta({pubkey: from, is_signer: true, is_writable: true}),
            AccountMeta({pubkey: to, is_signer: true, is_writable: true})
        ];

        bytes bincode = abi.encode(uint32(0), uint64(2039280), uint64(165), address"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

        address"11111111111111111111111111111111".call{accounts: metas, seeds: [["token", bump]]}(bincode);
    }
}


