class Cell {
  state = false
  nextState = false
  x = 0
  y = 0
  size = 0
  fillStyle = ''
  constructor (x, y, size, fillStyle) {
    this.x = x
    this.y = y
    this.size = size
    this.fillStyle = fillStyle
  }
  setNextState(state) {
    this.nextState = state
  }
  setNextStateBySiblingsCount(count) {
    const stateMap = {
      0: [false, false],
      1: [false, false],
      2: [false, true],
      3: [true, true],
      4: [false, false],
      5: [false, false],
      6: [false, false],
      7: [false, false],
      8: [false, false]
    }

    this.nextState = stateMap[count][Number(this.state)]
  }
  draw(ctx) {
    this.state = this.nextState
    if(this.state) {
      ctx.save()
      ctx.fillStyle = this.fillStyle
      ctx.fillRect(this.x, this.y, this.size, this.size)
      ctx.restore()
    }
  }
}

export default {
  name: 'Index',
  data () {
    return {
      run: false
    }
  },
  beforeCreate () {
    this.ctx = null
    this.areaSize = 500
    this.cellSize = 10
    this.strokeStyle = '#b3b3b3'
    this.fillStyle = '#88f'
    this.rows = []
  },
  mounted () {
    this.ctx = this.$refs.canvas.getContext('2d')
    // this.ctx.translate(-0.5, -0.5)
    this.initCells()
    this.initMouseEvents()
    this.initRender()
  },
  methods: {
    drawTable () {
      for (let i = 0; i < this.areaSize / this.cellSize; i++) {
        const offset = i * this.cellSize - 1 + 0.5

        this.ctx.moveTo(offset, 0.5)
        this.ctx.lineTo(offset, this.areaSize + 0.5)
        this.ctx.moveTo(0.5, offset)
        this.ctx.lineTo(this.areaSize + 0.5, offset)
      }

      this.ctx.save()
      this.ctx.strokeStyle = this.strokeStyle
      this.ctx.lineWidth = 1
      this.ctx.stroke()
      this.ctx.restore()
    },
    initCells() {
      const to = this.areaSize / this.cellSize
      const cSize = this.cellSize

      for(let y = 0; y < to; y++) {
        const row = []
        for(let x = 0; x < to; x++) {
          row.push(new Cell(x * cSize, y * cSize, this.cellSize - 1, this.fillStyle))
        }
        this.rows.push(row)
      }
    },
    drawCells() {
      const cellsForDraw = []

      this.rows.forEach((row, rowI) => {
        row.forEach((cell, cellI) => {
          if(this.run) {
            const siblingsCount = this.calcSiblings(rowI, cellI)
            if(siblingsCount) {
              console.log(`${rowI} ${cellI} = ${siblingsCount}`)
            }
            cell.setNextStateBySiblingsCount(siblingsCount)
          }
          cellsForDraw.push(cell)
        })
      })

      cellsForDraw.forEach(cell => cell.draw(this.ctx))
    },
    initMouseEvents() {
      this.$refs.canvas.addEventListener('click', e => {
        const rowIndex = Math.trunc(e.offsetY / this.cellSize)
        const cellIndex = Math.trunc(e.offsetX / this.cellSize)
        const cell = this.rows[rowIndex][cellIndex]
        cell.setNextState(!cell.state)
        cell.draw(this.ctx)
      })
    },
    initRender() {
      setInterval(() => {
        this.ctx.clearRect(0, 0, this.areaSize, this.areaSize)
        this.drawTable()
        this.drawCells()
      }, 500)
    },
    calcSiblings(rowI, cellI) {
      const yStart = rowI - 1
      const xStart = cellI - 1

      let weight = 0

      for(let yI = yStart; yI < yStart + 3; yI++) {
        for(let xI = xStart; xI < xStart + 3; xI++) {
          if(!(yI === rowI && xI === cellI)) {
            weight += Number(this.rows[yI]?.[xI]?.state ?? 0)
          }
        }
      }

      return weight
    }
  }
}
