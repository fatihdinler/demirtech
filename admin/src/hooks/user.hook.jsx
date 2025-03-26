import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/auth.context'
import { _getUser } from '../services/user.service'

const useUser = () => {
  const { auth } = useContext(AuthContext)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (auth?.user?.id) {
      _getUser(auth.user.id)
        .then((data) => {
          setUserData(data.data)
          setLoading(false)
        })
        .catch((err) => {
          setError(err)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [auth])

  return { user: userData, loading, error }
}

export default useUser
