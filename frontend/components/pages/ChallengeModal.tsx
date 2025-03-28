// import { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { AlertCircle, Share2 } from "lucide-react";
// import api from "@/lib/axios-helper";
// import html2canvas from "html2canvas";
// import { nanoid } from 'nanoid';

// interface ChallengeModalProps {
//   open: boolean;
//   setOpen: (open: boolean) => void;
// }

// const ChallengeModal = ({ open, setOpen }: ChallengeModalProps) => {
//   const [username, setUsername] = useState("");
//   const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [showShareOptions, setShowShareOptions] = useState(false);
//   const [imageUrl, setImageUrl] = useState("");
//   const inviteCardRef = useRef<HTMLDivElement | null>(null);

//   const [currentUser, setCurrentUser] = useState<{
//     username: string;
//     id: string | null;
//     score: number | null;
//   }>({
//     username: "",
//     id: null,
//     score: null,
//   });
  

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const res = await api.get("/auth/account");
//         setCurrentUser({
//           username: res.data.username,
//           id: res.data.id,
//           score: res.data.score,
//         });
//       } catch (error) {
//         console.error("Error fetching current user:", error);
//       }
//     };

//     if (open) fetchCurrentUser();
//   }, [open]);

//   useEffect(() => {
//     const checkUsername = async () => {
//       if (username.trim() === "") {
//         setIsAvailable(null);
//         return;
//       }
//       try {
//         setLoading(true);
//         const res = await api.post("/misc/username-check", {
//           username,
//         });
//         const data = res.data;
//         setIsAvailable(data.available);
//       } catch (error) {
//         console.error("Error checking username:", error);
//         setIsAvailable(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const delayDebounce = setTimeout(() => {
//       checkUsername();
//     }, 500);

//     return () => clearTimeout(delayDebounce);
//   }, [username]);

//   const handleChallenge = () => {
//     if (!isAvailable) return;
//     generateShareImage();
//     setShowShareOptions(true);
//   };

//   const generateShareImage = async () => {
//     if (!inviteCardRef.current) return;

//     try {
//       const canvas = await html2canvas(inviteCardRef.current, {
//         scale: 2, 
//         backgroundColor: null,
//       });

//       const imageData = canvas.toDataURL("image/png");
//       setImageUrl(imageData);
//     } catch (error) {
//       console.error("Error generating image:", error);
//     }
//   };

  
 
//   async function saveInvite() {
//     // try {
//     //   const saveInviteResponse = await api.post("/game/invite", {
//     //     inviterId: currentUser.id,
//     //     invitee: username,
//     //     score: currentUser.score,
//     //     inviteLink: inviteCode,
//     //   });

//     //   console.log(saveInviteResponse.data)
//     // } catch (error) {
//     //   console.error("Error saving invite:", error);
//     // }

//     try {
//      // Check if the inviteLink already exists by making a GET request to the backend
//     //  const checkInviteResponse = await api.get(`/game/invite-check/${inviteCode}`);
    
//     //  if (checkInviteResponse.data) {
//     //    // If invite exists, generate a new code and try again
//     //    console.log("Invite link already exists. Generating a new one.");
//     //    return saveInvite(); // Retry by generating a new invite code
//     //  }
 
//      // If no existing invite, proceed with saving the new invite
//      const inviteCode = nanoid(6);
    
//      const saveInviteResponse = await api.post("/game/invite", {
//        inviterId: currentUser.id,
//        invitee: username,
//        score: currentUser.score,
//        inviteLink: inviteCode,
//      });

//      console.log(currentUser.id, username, currentUser.score, inviteCode);
 
//      console.log("Invite saved successfully:", saveInviteResponse.data);
//      return inviteCode;
//     } catch (error) {
//      console.error("Error saving invite:", error);
//      return null;
//    }
//   }

//   const shareOnWhatsApp = async () => {
//     const inviteCode = await saveInvite();
//     console.log(inviteCode);
//     const inviteText = `Hey! ${currentUser.username} has challenged you to a game! Join now: `;
    
//     if (!inviteCode) {
//       console.error("Failed to generate invite code.");
//       return; 
//     }

//     // const inviteLink = `https://headout-challenge.vercel.app/join-challenge/${currentUser.id}/link?code=${encodeURIComponent(
//     //   inviteCode
//     // )}&username=${encodeURIComponent(username)}&score=${encodeURIComponent(currentUser.score)}`;

//     // fixed  nullable issue
//     const inviteLink = currentUser.id && currentUser.score !== null
//   ? `https://headout-challenge.vercel.app/join-challenge/${currentUser.id}/link?code=${encodeURIComponent(
//       inviteCode
//     )}&username=${encodeURIComponent(username)}&score=${encodeURIComponent(currentUser.score)}`
//   : "";

    
//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
//       inviteText + inviteLink
//     )}`;

//     window.open(whatsappUrl, "_blank");

//     setUsername("");
//     setShowShareOptions(false);
//     setOpen(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="sm:max-w-[425px]">
//         {!showShareOptions ? (
//           <>
//             <DialogHeader>
//               <DialogTitle>Challenge a Friend</DialogTitle>
//               <DialogDescription>
//                 Enter your friend's username to send them a challenge.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="py-4">
//               <Input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="mb-2"
//                 autoFocus
//               />

//               {username && (
//                 <div className="text-sm mt-1">
//                   {loading ? (
//                     <span className="text-gray-500">Checking...</span>
//                   ) : isAvailable === false ? (
//                     <span className="text-red-500 flex items-center">
//                       <AlertCircle className="w-4 h-4 mr-1" />
//                       Username is already taken.
//                     </span>
//                   ) : isAvailable === true ? (
//                     <span className="text-green-500">Username is available!</span>
//                   ) : null}
//                 </div>
//               )}
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleChallenge}
//                 disabled={!isAvailable || loading || username.trim() === ""}
//               >
//                 {loading ? "Checking..." : "Challenge"}
//               </Button>
//             </DialogFooter>
//           </>
//         ) : (
//           <>
//             <DialogHeader>
//               <DialogTitle>Share Challenge</DialogTitle>
//               <DialogDescription>
//                 Share this challenge with your friend on WhatsApp
//               </DialogDescription>
//             </DialogHeader>

//             <div className="py-4 flex flex-col items-center">
//               <div
//                 ref={inviteCardRef}
//                 className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg text-white w-full max-w-[300px] mb-4"
//               >
//                 <div className="text-center">
//                   <h3 className="text-xl font-bold mb-2">Game Challenge!</h3>
//                   <p className="mb-4">{currentUser.username} has challenged you to a game!</p>
//                   <div className="bg-white/20 p-3 rounded-md">
//                     <p className="font-semibold">Tap to accept the challenge</p>
//                   </div>
//                 </div>
//               </div>

//               {imageUrl && (
//                 <div className="mb-4">
//                   <img
//                     src={imageUrl}
//                     alt="Challenge card"
//                     className="rounded-lg shadow-md max-w-[250px]"
//                   />
//                 </div>
//               )}

//               <Button
//                 onClick={shareOnWhatsApp}
//                 className="w-full flex items-center justify-center gap-2"
//               >
//                 <Share2 className="w-4 h-4" />
//                 Share on WhatsApp
//               </Button>
//             </div>

//             <DialogFooter>
//               <Button variant="outline" onClick={() => setShowShareOptions(false)}>
//                 Back
//               </Button>
//             </DialogFooter>
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ChallengeModal;


"use client"

import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, Share2 } from "lucide-react"
import api from "@/lib/axios-helper"
import html2canvas from "html2canvas"
import { nanoid } from "nanoid"

interface ChallengeModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const ChallengeModal = ({ open, setOpen }: ChallengeModalProps) => {
  const [username, setUsername] = useState("")
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const inviteCardRef = useRef<HTMLDivElement | null>(null)

  const [currentUser, setCurrentUser] = useState<{
    username: string
    id: string | null
    score: number | null
  }>({
    username: "",
    id: null,
    score: null,
  })

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/auth/account")
        setCurrentUser({
          username: res.data.username,
          id: res.data.id,
          score: res.data.score,
        })
      } catch (error) {
        console.error("Error fetching current user:", error)
      }
    }

    if (open) fetchCurrentUser()
  }, [open])

  useEffect(() => {
    const checkUsername = async () => {
      if (username.trim() === "") {
        setIsAvailable(null)
        return
      }
      try {
        setLoading(true)
        const res = await api.post("/misc/username-check", {
          username,
        })
        const data = res.data
        setIsAvailable(data.available)
      } catch (error) {
        console.error("Error checking username:", error)
        setIsAvailable(null)
      } finally {
        setLoading(false)
      }
    }

    const delayDebounce = setTimeout(() => {
      checkUsername()
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [username])

  const handleChallenge = () => {
    if (!isAvailable) return
    generateShareImage()
    setShowShareOptions(true)
  }

  const generateShareImage = async () => {
    if (!inviteCardRef.current) return

    try {
      const canvas = await html2canvas(inviteCardRef.current, {
        scale: 2,
        backgroundColor: null,
      })

      const imageData = canvas.toDataURL("image/png")
      setImageUrl(imageData)
    } catch (error) {
      console.error("Error generating image:", error)
    }
  }

  async function saveInvite() {
    try {
      // Generate the invite code first
      const inviteCode = nanoid(6)

      console.log("Sending invite data:", {
        inviterId: currentUser.id,
        invitee: username,
        score: currentUser.score,
        inviteLink: inviteCode,
      })

      const saveInviteResponse = await api.post("/game/invite", {
        inviterId: currentUser.id,
        invitee: username,
        score: currentUser.score,
        inviteLink: inviteCode,
      })

      console.log("Invite saved successfully:", saveInviteResponse.data)
      return inviteCode
    } catch (error) {
      console.error("Error saving invite:", error)
      return null
    }
  }

  const shareOnWhatsApp = async () => {
    console.log("Starting shareOnWhatsApp function")
    const inviteCode = await saveInvite()
    console.log("Received invite code:", inviteCode)

    const inviteText = `Hey! ${currentUser.username} has challenged you to a game! Join now: `

    if (!inviteCode) {
      console.error("Failed to generate invite code.")
      return
    }

    // Check if currentUser.id and currentUser.score are valid
    if (!currentUser.id) {
      console.error("Missing currentUser.id")
      return
    }

    const inviteLink =
      currentUser.id && currentUser.score !== null
        ? `https://headout-challenge.vercel.app/join-challenge/${currentUser.id}/link?code=${encodeURIComponent(
            inviteCode,
          )}&username=${encodeURIComponent(username)}&score=${encodeURIComponent(currentUser.score)}`
        : ""

    console.log("Generated invite link:", inviteLink)

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(inviteText + inviteLink)}`

    window.open(whatsappUrl, "_blank")

    setUsername("")
    setShowShareOptions(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        {!showShareOptions ? (
          <>
            <DialogHeader>
              <DialogTitle>Challenge a Friend</DialogTitle>
              <DialogDescription>Enter your friend's username to send them a challenge.</DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-2"
                autoFocus
              />

              {username && (
                <div className="text-sm mt-1">
                  {loading ? (
                    <span className="text-gray-500">Checking...</span>
                  ) : isAvailable === false ? (
                    <span className="text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Username is already taken.
                    </span>
                  ) : isAvailable === true ? (
                    <span className="text-green-500">Username is available!</span>
                  ) : null}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleChallenge} disabled={!isAvailable || loading || username.trim() === ""}>
                {loading ? "Checking..." : "Challenge"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Share Challenge</DialogTitle>
              <DialogDescription>Share this challenge with your friend on WhatsApp</DialogDescription>
            </DialogHeader>

            <div className="py-4 flex flex-col items-center">
              <div
                ref={inviteCardRef}
                className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg text-white w-full max-w-[300px] mb-4"
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Game Challenge!</h3>
                  <p className="mb-4">{currentUser.username} has challenged you to a game!</p>
                  <div className="bg-white/20 p-3 rounded-md">
                    <p className="font-semibold">Tap to accept the challenge</p>
                  </div>
                </div>
              </div>

              {imageUrl && (
                <div className="mb-4">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Challenge card"
                    className="rounded-lg shadow-md max-w-[250px]"
                  />
                </div>
              )}

              <Button onClick={shareOnWhatsApp} className="w-full flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                Share on WhatsApp
              </Button>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowShareOptions(false)}>
                Back
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ChallengeModal

