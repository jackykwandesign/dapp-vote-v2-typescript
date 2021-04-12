
const ElectionV2 = artifacts.require('ElectionV2');

contract("ElectionV2", (accounts) =>{
    it("init with 0 votes", async () =>{
        const electionV2Instance = await ElectionV2.deployed();
        const count = await electionV2Instance.voteCounts()
        assert.equal(count.toNumber(),0, "not init with 0 votes")
    })

    it("add 1 vote", async() =>{
        const electionV2Instance = await ElectionV2.deployed();
        let voteName = "test vote 1"
        let organizerName = "HK voting organizer"
        let publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJvIlCBbeCn97THoiM2UVCl2ACsIhPdkEojqptGH22Kn663y+9LD/4KsqgR34FA8WCl6s4mHzzxLbOpDC7/dqvyjdorSg6zTkmq9CaSMUiRezQDLDYrvbeEh6xcqfx/xu1+/AM7XR6hj1UQQHIe1gs9DjjNli5UNnQjKiMPYFOrwIDAQAB"
        let privateKey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAIm8iUIFt4Kf3tMeiIzZRUKXYAKwiE92QSiOqm0YfbYqfrrfL70sP/gqyqBHfgUDxYKXqziYfPPEts6kMLv92q/KN2itKDrNOSar0JpIxSJF7NAMsNiu9t4SHrFyp/H/G7X78AztdHqGPVRBAch7WCz0OOM2WLlQ2dCMqIw9gU6vAgMBAAECgYBWnzuzSeUfQWvhWlKGQh5Mwuaeymbvkm9oElEcS0rERfVtkO91CV8xs7e7FTsr7DNK7hfAgCYVKKHPU3NSx1PASMNg6jUIIPo/Zp+HSkAHQoW6RTcg/NWHJRrB1rXCjD22sQ8RfnV/uHrRNRLUTDqoOFul4VarjZlJxqn9j/TAAQJBAOjHrv2LfrfKd5OCsLp+5LVFQdaEagQY2Dy3ghZRP0OWgV4ATNOrlJAYzhkD3qppOMElhXCLDF68bJxU6gnyLiECQQCXec1HU609K01/3SFYkHeWI5mr7cj6beYQ0d/yptbk3D5DqitYjHy7WCQR55gh7waQ3YOOLDRF9eQjSN/amcLPAkBRU9qmiMMYEWvfpKx8K/NaBb1v5kln7wo1hGO1ymMRCRdfsTkmRu8bvR7cjIaSATsr+CD75gjHXIuRvvUZznwhAkAqdf9AJkmiovfXhuIpFF4hXRtfoYk8AgCC6IIRYAlPIBnoF9SMvtzcG0oJJtVzdbBufVm6SdPhZJst9OijO4TrAkEAh2egifdGN28u8FRscA90fpjGYh8Tx5Iksx+ER78JmhdvZStaywAQ5KbIYvSym3n3tRsN0lXbahxZ0pA2qB7iEg=="
        let organizerAddress = accounts[1]
        let voteOptions = ['apple','banana','watermelon'];
        let voteCounts = voteOptions.length
        const receipt = await electionV2Instance.addVote(voteName,organizerName,publicKey, voteOptions, {from:organizerAddress})
        const count = await electionV2Instance.voteCounts()
        assert.equal(count.toNumber(),1, `count = ${count}, not add 1 new Vote`)

        // // uint id;
        // // string name;
        // // uint totalVotes;
        // // string organizerName;
        // // address organizerAddress;
        // // string publicKey;
        // // uint voteOptionCount;
        // // mapping(uint => VoteOption) voteOptions;

        let voteID = 1
        const vote = await electionV2Instance.votes(voteID)
        assert.equal(vote[0].toNumber(),1, `vote ID not equal to ${voteID}`)
        assert.equal(vote[1],voteName, `vote name not equal to ${voteName}`)
        assert.equal(vote[2].toNumber(),0, `total vote count not equal to ${0}`)
        assert.equal(vote[3],organizerName, `vote organizerName not equal to ${organizerName}`)
        assert.equal(vote[4],organizerAddress, `vote organizerAddress not equal to ${organizerAddress}`)
        assert.equal(vote[5],publicKey, `vote publicKey not equal to ${publicKey}`)
        assert.equal(vote[6].toNumber(),voteCounts, `voteOptionCount not equal to ${voteCounts}`)
        
        // check if exist in myVotes
        const myVotes = await electionV2Instance.getMyVotes({from:organizerAddress});
        assert.equal(myVotes.length, 1, "not found 1 vote i myVotes")
        assert.equal(myVotes[0].toNumber(), 1, "myVote[0] voteID ot equal to 1")

        const voteOptionCount = vote[6].toNumber()
        for(let i = 1; i <= voteOptionCount; i++){
            const voteOption = await electionV2Instance.getVoteOptionOfVote(voteID, i);
            assert.equal(voteOption,voteOptions[i - 1], `voteOption #${i} name ${voteOption} not equal to ${voteOptions[i - 1]}`)
        }

    })


})