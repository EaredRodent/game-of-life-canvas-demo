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

    if(this.nextState !== this.state) {
      console.log(count)
    }
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
      ctx: null,
      areaSize: 500,
      cellSize: 10,
      strokeStyle: '#b3b3b3',
      fillStyle: '#88f',
      rows: [],
      run: false
    }
  },
  mounted () {
    this.ctx = this.$refs.canvas.getContext('2d')
    this.ctx.translate(0.5, 0.5)
    this.initCells()
    this.initMouseEvents()
    this.initRender()
  },
  methods: {
    drawTable () {
      for (let i = 0; i < this.areaSize / this.cellSize; i++) {
        const offset = i * this.cellSize - 1

        this.ctx.moveTo(offset, 0)
        this.ctx.lineTo(offset, 500)
        this.ctx.moveTo(0, offset)
        this.ctx.lineTo(500, offset)
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
      this.rows.forEach((row, rowI) => {
        row.forEach((cell, cellI) => {
          if(this.run) {
            const siblingsCount = this.calcSiblings(rowI, cellI)
            cell.setNextStateBySiblingsCount(siblingsCount)
          }
          cell.draw(this.ctx)
        })
      })
    },
    initMouseEvents() {
      this.$refs.canvas.addEventListener('click', e => {
        const rowIndex = Math.trunc(e.offsetY / this.cellSize)
        const cellIndex = Math.trunc(e.offsetX / this.cellSize)
        const cell = this.rows[rowIndex][cellIndex]
        cell.setNextState(!cell.state)
      })
    },
    initRender() {
      setInterval(() => {
        this.ctx.clearRect(0, 0, this.areaSize, this.areaSize)
        this.drawTable()
        this.drawCells()
      }, 1000)
    },
    calcSiblings(xICenter, yICenter) {
      const xStart = xICenter - 1
      const yStart = yICenter - 1

      let weight = 0

      for(let yI = yStart; yI < yStart + 3; yI++) {
        for(let xI = xStart; xI < xStart + 3; xI++) {
          if(yI !== yICenter && xI !== xICenter) {
            weight += Number(this.rows[yI]?.[xI]?.state ?? 0)
          }
        }
      }

      return weight
    }
  }
}
