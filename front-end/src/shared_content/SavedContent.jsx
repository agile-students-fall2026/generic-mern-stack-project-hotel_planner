import { createContext, useContext, useState } from "react";

const SavedContext = createContext(null);

export function SavedContent({ children }) {
    const [savedItems, setSavedItems] = useState([
        {
        id: 1,
        name: "Hotel Aurora",
        location: "Paris, France",
        date: "2026-12-14",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        },
        {
        id: 2,
        name: "The Maple Inn",
        location: "Vermont, USA",
        date: "2027-01-05",
        description: "Saved Hotel 2",
        },
        {
        id: 3,
        name: "Casa del Sol",
        location: "Barcelona, Spain",
        date: "2027-02-20",
        description: "Saved Hotel 3",
        },
        {
        id: 4,
        name: "Harbor View Suites",
        location: "Sydney, Australia",
        date: "2027-03-11",
        description: "Saved Hotel 4",
        },
        {
        id: 5,
        name: "Lotus Garden Resort",
        location: "Kyoto, Japan",
        date: "2027-04-02",
        description: "Saved Hotel 5",
        },
    ]);

    const sameId = (a, b) => String(a) === String(b);

    const isSaved = (id) => savedItems.some((item) => sameId(item.id, id));

    const addSaved = (hotel) => {
        setSavedItems((savedList) =>
            savedList.some((item) => sameId(item.id, hotel.id)) ? savedList : [...savedList, hotel]
        );
    };

    const removeSaved = (id) => {
        setSavedItems((savedList) => savedList.filter((item) => !sameId(item.id, id)));
    };

    const toggleSaved = (hotel) => {
        if (isSaved(hotel.id)) {
            removeSaved(hotel.id);
        } else {
            addSaved(hotel);
        }
    };

    const updateDescription = (id, newDescription) => {
        setSavedItems((savedList) =>
            savedList.map((item) =>
                sameId(item.id, id) ? { ...item, description: newDescription } : item
            )
        );
    };

    return (
    <SavedContext.Provider value={{ savedItems, isSaved, toggleSaved, removeSaved, updateDescription }}>
        {children}
    </SavedContext.Provider>
    );
}

export function useSaved() {
    const context = useContext(SavedContext);
    if (!context) {
        throw new Error("useSaved must be used inside <SavedContent>");
    }
    return context;
}