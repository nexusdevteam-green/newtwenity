const names = [
  'Marta Vidal',
  'Dani Souto',
  'Lucía Rey',
  'Pablo Cortés',
  'Nerea Blanco',
  'Iker Salas',
  'Claudia Ferrer',
  'Hugo Prieto',
]

const friends = [1, 2, 3, 4, 9, 11, 13, 14].map((imgId, index) => ({
  id: imgId,
  name: names[index],
  avatar: `https://i.pravatar.cc/80?img=${imgId}`,
}))

export default friends
