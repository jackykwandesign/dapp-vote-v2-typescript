
const Election = artifacts.require('Election');

contract("Election", (accounts) =>{
    it("init with 3 candidates", async () =>{
        const electionInstance = await Election.deployed();
        const count = await electionInstance.candidatesCount()
        assert.equal(count.toNumber(),3, "not init with 3 candidate")
    })

    it("init with candidates with correct info", async () =>{
        const electionInstance = await Election.deployed();
        const candidate1 = await electionInstance.candidates(1)
        assert.equal(candidate1[0].toNumber(), 1, "contain correct id")
        assert.equal(candidate1[1], "Candidate 1", "contain correct name")
        assert.equal(candidate1[2].toNumber(), 0, "contain correct votes")

        const candidate2 = await electionInstance.candidates(2)
        assert.equal(candidate2[0].toNumber(), 2, "contain correct id")
        assert.equal(candidate2[1], "Candidate 2", "contain correct name")
        assert.equal(candidate2[2].toNumber(), 0, "contain correct votes")

        const candidate3 = await electionInstance.candidates(3)
        assert.equal(candidate3[0].toNumber(), 3, "contain correct id")
        assert.equal(candidate3[1], "Candidate 3", "contain correct name")
        assert.equal(candidate3[2].toNumber(), 0, "contain correct votes")

    })

    it("allow user to vote", async () =>{
        const electionInstance = await Election.deployed();
        let candidateId = 1
        const receipt = await electionInstance.vote(candidateId, {from: accounts[0]})
        const voted =  await electionInstance.voters(accounts[0])
        assert(voted, "the voter is voted")
        const candidate = await electionInstance.candidates(candidateId)
        assert.equal(candidate[2].toNumber(), 1, "increase candidate 1 vote count by 1")
    })

    it("block invalid candidateId", async ()=>{
        const electionInstance = await Election.deployed();
        let candidateId = 99
        try {
            await electionInstance.vote(candidateId, {from: accounts[0]})
        } catch (error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert")
        }
        const candidate1 = await electionInstance.candidates(1)
        assert.equal(candidate1[2].toNumber(), 1, "candidate 1 not receive an invalid vote")
        const candidate2 = await electionInstance.candidates(2)
        assert.equal(candidate2[2].toNumber(), 0, "candidate 2 not receive an invalid vote")
        const candidate3 = await electionInstance.candidates(3)
        assert.equal(candidate3[2].toNumber(), 0, "candidate 3 not receive an invalid vote")
        const candidate99 = await electionInstance.candidates(99)
        assert.equal(candidate99[2].toNumber(), 0, "candidate 99 not receive an invalid vote")
    })

    it("block duplicate vote", async ()=>{
        const electionInstance = await Election.deployed()
        let candidateId = 1
        const receipt = await electionInstance.vote(candidateId, {from: accounts[2]})
        const candidate = await electionInstance.candidates(candidateId)
        assert.equal(candidate[2].toNumber(), 2, `candidate ${candidateId} receive an extra vote`)

        try {
            await electionInstance.vote(candidateId, {from: accounts[2]})
        } catch (error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert")
        }

        const candidate1 = await electionInstance.candidates(1)
        assert.equal(candidate1[2].toNumber(), 2, "candidate 1 not receive an invalid vote")
        const candidate2 = await electionInstance.candidates(2)
        assert.equal(candidate2[2].toNumber(), 0, "candidate 2 not receive an invalid vote")
        const candidate3 = await electionInstance.candidates(3)
        assert.equal(candidate3[2].toNumber(), 0, "candidate 3 not receive an invalid vote")

    })
})