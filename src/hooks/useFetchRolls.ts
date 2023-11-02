import { useEffect, useState } from "react";
import { Note } from "../types/Note";

export default function useFetchRolls() {
	const [data, setData] = useState<Note[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			try {
				const response = await fetch('https://pianoroll.ai/random_notes');
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const jsonData = await response.json();
				setData(jsonData)
			} catch (error) {
				console.error('Error loading data:', error);
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [])

	return { data, isLoading }
}