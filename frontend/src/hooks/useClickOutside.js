import { useEffect, useRef } from 'react'

// Cierra un menú/desplegable al hacer clic en cualquier parte fuera de `ref`,
// sin interferir con el propio botón que lo abre/cierra.
function useClickOutside(active, onOutside) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active) return

    function handleClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutside()
      }
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [active, onOutside])

  return ref
}

export default useClickOutside
