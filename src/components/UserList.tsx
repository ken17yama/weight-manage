import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface User {
	id: number
	name: string
	height: number
}

const userInitial: User = {
	id: 0,
	name: '',
	height: 0,
}

const UserList = () => {

	const [users, setUsers] = useState([userInitial])

	const ROOT_URL = "http://localhost:3003";

	useEffect(() => {
		const fetchData = async () => {
			const res = await axios.get(`${ROOT_URL}/api/users`)
			setUsers(res.data)
		}

		fetchData();
	}, []);

	return (
		<table>
			<thead>
				<tr>
					<th>名前</th>
					<th>身長</th>
				</tr>
			</thead>
			<tbody>
				{users.map(user => (
					<tr key={user.id}>
						<td>{user.name}</td>
						<td>{user.height}cm</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default UserList
