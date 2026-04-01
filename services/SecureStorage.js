import * as SecureStore from 'expo-secure-store';

const NOTES_KEY =   'secure_notes_data';

export const SecureStorage = {

    saveNotes : async (notesArray) => {
        try {
            const jsonValue = JSON.stringify(notesArray)
            await SecureStorage.setItemAsync(NOTES_KEY,jsonValue);
            console.log("Notes encrypted and stored Successfully")
        } catch (error) {
            console.error("Error in saving notes securly",error)
        }
    },

    getNotes: async () => {
        try {
            const jsonValue = await SecureStore.getItemAsync(NOTES_KEY)
            return jsonValue != null ? JSON.parse(jsonValue):[];  
        } catch (error) {
            console.error("Error retrieving secure notes:",error)
            return [];
        }
    },

    deleteAllNotes : async () => {
        try {
            await SecureStore.deleteItemAsync(NOTES_KEY);
            console.log("All secure notes wiped");      
        } catch (error) {
            console.error("Error deleting notes: ",error);
        }
    }
}