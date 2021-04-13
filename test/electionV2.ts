
const ElectionV2 = artifacts.require('ElectionV2');
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 512});
const publicPem = key.exportKey('public');
const privatePem = key.exportKey('private');
// console.log("publicPem", publicPem)
// console.log("privatePem", privatePem)
// let publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJvIlCBbeCn97THoiM2UVCl2ACsIhPdkEojqptGH22Kn663y+9LD/4KsqgR34FA8WCl6s4mHzzxLbOpDC7/dqvyjdorSg6zTkmq9CaSMUiRezQDLDYrvbeEh6xcqfx/xu1+/AM7XR6hj1UQQHIe1gs9DjjNli5UNnQjKiMPYFOrwIDAQAB"
// let privateKey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAIm8iUIFt4Kf3tMeiIzZRUKXYAKwiE92QSiOqm0YfbYqfrrfL70sP/gqyqBHfgUDxYKXqziYfPPEts6kMLv92q/KN2itKDrNOSar0JpIxSJF7NAMsNiu9t4SHrFyp/H/G7X78AztdHqGPVRBAch7WCz0OOM2WLlQ2dCMqIw9gU6vAgMBAAECgYBWnzuzSeUfQWvhWlKGQh5Mwuaeymbvkm9oElEcS0rERfVtkO91CV8xs7e7FTsr7DNK7hfAgCYVKKHPU3NSx1PASMNg6jUIIPo/Zp+HSkAHQoW6RTcg/NWHJRrB1rXCjD22sQ8RfnV/uHrRNRLUTDqoOFul4VarjZlJxqn9j/TAAQJBAOjHrv2LfrfKd5OCsLp+5LVFQdaEagQY2Dy3ghZRP0OWgV4ATNOrlJAYzhkD3qppOMElhXCLDF68bJxU6gnyLiECQQCXec1HU609K01/3SFYkHeWI5mr7cj6beYQ0d/yptbk3D5DqitYjHy7WCQR55gh7waQ3YOOLDRF9eQjSN/amcLPAkBRU9qmiMMYEWvfpKx8K/NaBb1v5kln7wo1hGO1ymMRCRdfsTkmRu8bvR7cjIaSATsr+CD75gjHXIuRvvUZznwhAkAqdf9AJkmiovfXhuIpFF4hXRtfoYk8AgCC6IIRYAlPIBnoF9SMvtzcG0oJJtVzdbBufVm6SdPhZJst9OijO4TrAkEAh2egifdGN28u8FRscA90fpjGYh8Tx5Iksx+ER78JmhdvZStaywAQ5KbIYvSym3n3tRsN0lXbahxZ0pA2qB7iEg=="

contract("ElectionV2", (accounts) =>{
    it("init with 0 votes", async () =>{
        const electionV2Instance = await ElectionV2.deployed();
        const count = await electionV2Instance.contractVoteCounts()
        assert.equal(count.toNumber(),0, "not init with 0 votes")
    })

    it("add 1 vote", async() =>{
        const electionV2Instance = await ElectionV2.deployed();
        let voteName = "test vote 1"
        let organizerName = "HK voting organizer"
 
        let organizerAddress = accounts[1]
        let dummyVoteOptions = ['apple','banana','watermelon'];
        let voteCounts = dummyVoteOptions.length
        const receipt = await electionV2Instance.addVote(voteName,organizerName,publicPem, dummyVoteOptions, {from:organizerAddress})
        const count = await electionV2Instance.contractVoteCounts()
        assert.equal(count.toNumber(),1, `count = ${count}, not add 1 new Vote`)

        let voteID = 1
        const vote = await electionV2Instance.contractVotes(voteID)
        assert.equal(vote[0].toNumber(),1, `vote ID not equal to ${voteID}`)
        assert.equal(vote[1],voteName, `vote name not equal to ${voteName}`)
        assert.equal(vote[2],organizerName, `vote organizerName not equal to ${organizerName}`)
        assert.equal(vote[3],organizerAddress, `vote organizerAddress not equal to ${organizerAddress}`)
        assert.equal(vote[4],publicPem, `vote publicKey not equal to ${publicPem}`)
        assert.equal(vote[5],"", `vote privateKey not empty at beginning`)
        assert.equal(vote[6].toNumber(),voteCounts, `voteOptionCount not equal to ${voteCounts}`)
        
        assert.equal(vote[7].toNumber(),0, `total vote count not equal to ${0}`)

        // check if exist in myVotes
        const myVotes = await electionV2Instance.getMyOrganizedVotes({from:organizerAddress});
        assert.equal(myVotes.length, 1, "not found 1 vote i myVotes")
        assert.equal(myVotes[0].toNumber(), 1, "myVote[0] voteID ot equal to 1")

        const voteOptions = await electionV2Instance.getVoteOptionsByVoteID(voteID);
        assert.equal(voteOptions.length,voteCounts,`total voteOptions not equal to ${voteCounts}`)
        for(let i = 0; i < voteOptions.length; i++){
            assert.equal(voteOptions[i].name,dummyVoteOptions[i], `voteOption #${voteOptions[i].id} name ${voteOptions[i].name} not equal to ${dummyVoteOptions[i]}`)
        }

    })

    it("vote to specific vote by voteID", async() =>{
        const electionV2Instance = await ElectionV2.deployed();
        
        let existVoteID = 1;
        let notExistVoteID = 2;
        let ballot = 2
        let signature = "5678"
        const voteBefore = await electionV2Instance.contractVotes(existVoteID)
        assert.equal(voteBefore[7].toNumber(), 0, `total votes not equal to ${0} before vote`)
        const publicKeyInContract = voteBefore[4]
        const pKey = new NodeRSA();
        pKey.importKey(publicKeyInContract, 'public');
        let encryptedBallot = pKey.encrypt(ballot,'base64')
        // const originalBallot = key.decrypt(encryptedBallot,'json')
        // console.log("originalBallot", originalBallot)
        try {
            await electionV2Instance.caseVoteByVoteID(notExistVoteID,encryptedBallot, signature)
        } catch (error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert")
        }

        await electionV2Instance.caseVoteByVoteID(existVoteID,encryptedBallot, signature)
        const voteAfter = await electionV2Instance.contractVotes(existVoteID)
        let ticketCount = voteAfter[7].toNumber()
        assert.equal(ticketCount, 1, `total votes not equal to ${1} after vote`)

        
        const voteTickets = await electionV2Instance.getVoteTicketsByVoteID(existVoteID)
        assert.equal(voteTickets.length,ticketCount,`total vote tickets not equal to ${ticketCount}`)
        // console.log("voteTickets",voteTickets)
        // console.log("voteTickets[0].id",voteTickets[0].id)
        assert.equal(Number(voteTickets[0].id), 1, `vote ticket ID not equal to ${1} `)
        assert.equal(voteTickets[0].encryptedBallot, encryptedBallot, `vote ticket encryptedBallot not equal to encryptedBallot ${encryptedBallot} `)
        assert.equal(voteTickets[0].signature, signature, `vote ticket signature not equal to signature ${signature} `)

        const keyProvideByOrganizer = new NodeRSA();
        keyProvideByOrganizer.importKey(privatePem,'private')
        let decryptOption = keyProvideByOrganizer.decrypt(voteTickets[0].encryptedBallot,'json')
        assert.equal(decryptOption, ballot, `decrypt vote ticket not equal to ballot ${ballot} `)
    })


})