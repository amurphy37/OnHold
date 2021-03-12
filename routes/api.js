const express = require("express")
const router = express.Router()
const Axios = require("axios")

router.post("/onHoldWebhook", async (req, res) => {

    try {

        const hookSecret = req.headers["x-hook-secret"]
        res.set("X-Hook-Secret", hookSecret)
        res.status(200).send("success!")

        const jobID = req.body.job_id
        var candidateID = req.body.candidate_id

        const apiKey = "DCRA1-9f0a1db322564c64872b2d8979b4124a"

        const candidateURL = "https://api.smartrecruiters.com/candidates/" + candidateID

        const candidateInfo = await Axios.get(candidateURL, {
            headers: {
                "X-SmartToken": apiKey
            }
        })

        console.log(candidateInfo)

        if (candidateInfo.data.primaryAssignment.subStatus === "Eligibility Check") {

            const secondaryAssignments = candidateInfo.data.secondaryAssignments

            if (!secondaryAssignments) {
                console.log("only one job")
            }
            else {
                console.log("more than one job")
    
                var isEligible = true
    
                for (i=0; i < secondaryAssignments.length; i++) {
    
                    if (secondaryAssignments[i].status === "OFFERED" || secondaryAssignments[i].status === "INTERVIEW") {
                        isEligible = false
                    }
    
                }
    
                if(isEligible) {

                    console.log("candidate is elibile for interview")

                    const updateURL = "https://api.smartrecruiters.com/candidates/" + candidateID + "/jobs/" + jobID + "/status"
    
                    const update = {
                        "status": "INTERVIEW",
                        "subStatus": "Ready to Process"
                      }
    
                   const candidateUpdate = await Axios.put(updateURL, update, {
                            headers: {
                                "X-SmartToken": apiKey
                            }
                    })

                    console.log(candidateUpdate)


    
                    // System then allows candidate to move forward in process and automatically puts candidate in ready to process status
                }
    
                // Reverting candidate back to Review Application stage if the candidate is in interview or offered status on other job. 
    
                else {

                    console.log("candidate in offer or interview status on other job. Candidate is dispositioned to review application status automatically")
    
                    const updateURL = "https://api.smartrecruiters.com/candidates/" + candidateID + "/jobs/" + jobID + "/status"
    
                    const update = {
                        "status": "IN_REVIEW",
                        "subStatus": "Review Application"
                      }
    
                   const candidateUpdate = await Axios.put(updateURL, update, {
                            headers: {
                                "X-SmartToken": apiKey
                            }
                    })

                    console.log(candidateUpdate)
                }
        
            }
        }

        else {
            console.log("not elgibility check -- ignore")
        }
    }
    catch (error) {
        console.log(error)
    }



})

module.exports = router;