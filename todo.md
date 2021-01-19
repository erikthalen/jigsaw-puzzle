- resize handler (maybe)
- mobile support
- dynamic piece shapes

- create back/forground on drag (put active pieces in for- and rest in back)

- breaks with config.pieces.x = 1 (that's not a puzzle though...)

* refactor state-mutators to return new object

## done

- 'snap' when two pieces are close
- visual feedback on activation (f.e. drop shadow)
- create initState()
- save/revert puzzle state
- hit area when the page is scrolled
- piece shape
- correct image rendering (size and crop)
- move connections together with snapped piece
- pieces can be dragged/dropped outside canvas
- init with a saved game

* merge activePiece and alsoActivePiece

- more robust get/setState
- check if any piece is close to it's neighbor (not only activePiece)
