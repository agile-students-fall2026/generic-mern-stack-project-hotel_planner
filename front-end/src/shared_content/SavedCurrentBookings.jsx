import { createContext, useContext, useState } from "react";

const curBookingContext = createContext(null);

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

    const toggleBookingSaved = (hotel) => {
        if (isBookingSaved(hotel.id)) {
            deleteBooking(hotel.id);
        } else {
            addBooking(hotel);
        }
    };

    return (
        <curBookingContext.Provider value = {{curBookings, addBooking, deleteBooking, toggleBookingSaved, isBookingSaved}}>
            {children}
        </curBookingContext.Provider>
    )
}

export function useCurBookings(){
    const context = useContext(curBookingContext);
    if(!context) throw new Error("Use in a <SavedCurrentBookings>");
    return context;
}