import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io("wss://");
const roomID = "test-room";

function VoiceCall() {
  //Set up useStates
  const [whichButton, setWhichButton] = useState(false);
  const [voiceUsers, setvoiceUsers] = useState([]);
  const [localStream, setlocalStream] = useState(null);
  const [remoteStream, setremoteStream] = useState(null);
  const peerConnection = useRef({});
  // ICE setup
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    iceTransportPolicy: "relay",
  };

  //Handle Mute Button
  const muteElem = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };
  //Handle Joining call/leave call button
  const toggleButton = () => {
    setWhichButton(!whichButton);
    if (!whichButton) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setlocalStream(stream);
          socket.emit("join-call", roomID);
        })
        .catch((error) => {
          console.error("Error accessing audio devices:", error);
        });
    } else {
      socket.emit("leave-call", roomID);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setlocalStream(null);
      }
      Object.values(peerConnection.current).forEach((pc) => pc.close());
      peerConnection.current = {};
      setremoteStream([]);
    }
  };
  // Add Event Listeners for joining and leaving call on mount **Send to callAPI** / Update voiceUsers
  useEffect(() => {
    socket.on("user-joined", (user) => {
      console.log("User has connected:", socket.id);
      setvoiceUsers(user);
    });
    socket.on("user-left", (user) => {
      console.log("User Disconnected:", socket.id);
      setvoiceUsers(user);
    });

    //Handle audio streams for RemoteUsers and LocalUsers
    socket.on("new-participant", async (user) => {
      const newPeerConnect = new RTCPeerConnection(configuration);
      peerConnection.current[user] = newPeerConnect;
      newPeerConnect.ontrack = (e) => {
        setremoteStream((pStream) => [
          ...pStream,
          { id: user, stream: e.streams[0] },
        ]);
        localStream
          .getAudioTracks()
          .forEach((track) => newPeerConnect.addTrack(track, localStream));
      };
      //Handle Ice candidates
      newPeerConnect.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", { candidate: e.candidate, to: user });
        }
      };
      const offer = await newPeerConnect.createOffer();
      await newPeerConnect.setLocalDescription(offer);
      socket.emit("offer", { offer, to: user });
    });
    socket.on("offer", async ({ offer, ID }) => {
      const newPeerConnect = new RTCPeerConnection(configuration);
      peerConnection.current[ID] = newPeerConnect;

      if (localStream) {
        localStream
          .getAudioTracks()
          .forEach((track) => newPeerConnect.addTrack(track, localStream));
      }
      newPeerConnect.ontrack = (event) => {
        setremoteStream((prevStreams) => [
          ...prevStreams,
          { id: ID, stream: event.streams[0] },
        ]);
      };

      // Handle ICE candidates
      newPeerConnect.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", { candidate: e.candidate, to: ID });
        }
      };

      // Set remote description with the received offer
      await newPeerConnect.setRemoteDescription(offer);
      // Create an answer to send back to the other participant
      const answer = await newPeerConnect.createAnswer();
      await newPeerConnect.setLocalDescription(answer);
      socket.emit("answer", { answer, to: ID });
    });

    // Handle answer from another participant
    socket.on("answer", async ({ answer, ID }) => {
      const connection = peerConnection.current[ID];
      if (connection) {
        await connection.setRemoteDescription(answer);
      }
    });

    // Handle ICE candidate received from another participant
    socket.on("ice-candidate", async ({ candidate, ID }) => {
      const connection = peerConnection.current[ID];
      if (connection && candidate) {
        await connection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
    socket.on("participant-left", (userID) => {
      setremoteStream((prevStreams) =>
        prevStreams.filter((user) => user.id !== userID)
      );
      setvoiceUsers((prevUsers) =>
        prevUsers.filter((streamObj) => streamObj.id !== userID)
      );
    });
    return () => {
      socket.disconnect();
      Object.values(peerConnection.current).forEach((pc) => pc.close());
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("new-participant");
      socket.off("ice-candidate");
      socket.off("offer");
      socket.off("answer");
      socket.off("participant-left");
    };
  }, [localStream]);
  return (
    <div className="voice-box">
      <h1>Voice Call</h1>
      <ul>
        {voiceUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <span className="voice-buttons">
        {!whichButton ? (
          <button className="join-button" onClick={toggleButton}>
            Join Call
          </button>
        ) : (
          <button className="leave-button" onClick={toggleButton}>
            Leave Call
          </button>
        )}
        <button className="mute-button" onClick={() => muteElem()}>
          Mute
        </button>
      </span>
    </div>
  );
}

export default VoiceCall;
