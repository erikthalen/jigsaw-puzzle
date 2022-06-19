import { tap } from '../../utils/utils'

export const status = tap(puzzle => {
  if (puzzle.status === 'active') {
    puzzle.moves = puzzle.moves + 1
  }

  if (
    puzzle.pieces[0].connections.length === puzzle.size.y * puzzle.size.x &&
    !puzzle.done
  ) {
    puzzle.done = true
  }
})
