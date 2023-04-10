import { useState, useEffect } from "react";
import axios from "../../axios/axios";
import Footer from "../../components/user/Footer/Footer";
import Navbar from "../../components/user/Navbar/Navbar";
import RoomType from "../../components/user/RoomType";
import Loader from "../../components/user/Loader";

function RoomTypes() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchRoomTypes() {
      setLoaded(true);
      try {
        const response = await axios.get("/roomTypes");
        console.log(response.data);
        setRoomTypes(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoaded(false);
      }
    }
    fetchRoomTypes();
  }, []);

  return (
    <div>
      {loaded ? (
        <Loader />
      ) :
        <>
          <Navbar />
            {roomTypes.map((roomType) => (
              <RoomType key={roomType._id} roomType={roomType} />
            ))}
          <Footer />
        </>
      }
    </div>
  );
}

export default RoomTypes;
