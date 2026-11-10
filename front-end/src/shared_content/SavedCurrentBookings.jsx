import { createContext, useContext, useState } from "react";

const curBookingContext = createContext(null);

{/*used to share data to children in order for different files to have access to some shared data*/}
export function SavedCurrentBooking({ children }){
    const [curBookings, setCurBookings] = useState([]);
    
    const sameId = (a, b) => String(a) === String(b);

    const isBookingSaved = (id) => curBookings.some((item) => sameId(item.id, id));

    const addBooking = (hotel) => {
        setCurBookings((savedList)=>
            [...savedList, hotel]
        );
    }

    const deleteBooking = (id) => {
        setCurBookings((savedList)=>
            savedList.filter((item) => !sameId(item.id, id))
        );
    }

    const toggleBookingSaved = (hotel) => { {/*ran when the save/book buttons in hotel details is ran*/}
        if (isBookingSaved(hotel.id)) {
            deleteBooking(hotel.id);
        } else {
            addBooking(hotel);
        }
    };

    const updateBooking = (id, newDescription, newCheckIn, newCheckOut) => {
        setCurBookings((bookingList) =>
            bookingList.map((item) =>
                sameId(item.id, id) ? { ...item, description: newDescription, checkIn: newCheckIn, checkOut: newCheckOut} : item
            )
        );
    };

    return (
        <curBookingContext.Provider value = {{curBookings, addBooking, deleteBooking, toggleBookingSaved, isBookingSaved, updateBooking}}>
            {children}
        </curBookingContext.Provider>
    )
}

export function useCurBookings(){
    const context = useContext(curBookingContext);
    if(!context) throw new Error("Use in a <SavedCurrentBookings>");
    return context;
}