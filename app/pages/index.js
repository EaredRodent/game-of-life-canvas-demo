class Cell {
  state = false
  nextState = false
  x = 0
  y = 0
  size = 0
  fillStyle = ''
  constructor (x, y, size) {
    this.x = x
    this.y = y
    this.size = size
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
    if(this.state) {
      ctx.rect(this.x, this.y, this.size, this.size)
    }
  }
}

export default {
  name: 'Index',
  data () {
    return {
      run: false,
      cellsUpdateDelay: 500,
      cellSize: 10,
      fps: 0
    }
  },
  beforeCreate () {
    this.ctx = null
    this.areaSize = 500
    this.strokeStyle = '#b3b3b3'
    this.fillStyle = '#000'
    this.rows = []
  },
  mounted () {
    this.ctx = this.$refs.canvas.getContext('2d')
    this.initCells()
    this.initMouseEvents()
    this.initRender()
  },
  watch: {
    cellSize() {
      this.initCells()
    }
  },
  methods: {
    drawTable () {
      for (let i = 0; i < this.areaSize / this.cellSize; i++) {
        const offset = i * this.cellSize - 1

        this.ctx.moveTo(offset + 0.5, 0)
        this.ctx.lineTo(offset + 0.5, this.areaSize)
        this.ctx.moveTo(0, offset + 0.5)
        this.ctx.lineTo(this.areaSize, offset + 0.5)
      }
    },
    initCells() {
      const to = this.areaSize / this.cellSize
      const cSize = this.cellSize

      this.rows = []

      for(let y = 0; y < to; y++) {
        const row = []
        for(let x = 0; x < to; x++) {
          row.push(new Cell(x * cSize, y * cSize, this.cellSize - 1, this.fillStyle))
        }
        this.rows.push(row)
      }
    },
    updateCellsState() {
      ['setNextState', 'setState'].forEach(workType => {
        this.rows.forEach((row, rowI) => {
          row.forEach((cell, cellI) => {
            if(workType === 'setNextState') {
              const siblingsCount = this.calcSiblings(rowI, cellI)
              cell.setNextStateBySiblingsCount(siblingsCount)
            }
            if(workType === 'setState') {
              cell.state = cell.nextState
            }
          })
        })
      })
    },
    initMouseEvents() {
      this.$refs.canvas.addEventListener('click', e => {
        const rowIndex = Math.trunc(e.offsetY / this.cellSize)
        const cellIndex = Math.trunc(e.offsetX / this.cellSize)
        const cell = this.rows[rowIndex][cellIndex]
        cell.state = !cell.state
      })
    },
    initRender() {
      let cellsStateUpdatedTs = 0
      let fpsTsStart = Date.now()
      let fpsCount = 0


      const renderWork = () => {
        this.ctx.clearRect(0, 0, this.areaSize, this.areaSize)

        this.drawTable()

        const currentTs = Date.now()
        const fromLastUpdateMs = currentTs - cellsStateUpdatedTs

        if((this.cellsUpdateDelay <= fromLastUpdateMs) && this.run) {
          this.updateCellsState()
          cellsStateUpdatedTs = currentTs
        }

        this.rows.forEach(row => {
          row.forEach(cell => {
            if(cell.state) {
              cell.draw(this.ctx)
            }
          })
        })

        this.ctx.save()
        this.ctx.strokeStyle = this.strokeStyle
        this.ctx.lineWidth = 1
        this.ctx.stroke()
        this.ctx.fillStyle = this.fillStyle
        this.ctx.fill()
        this.ctx.restore()
        this.ctx.beginPath()

        const fpsTsDiff = currentTs - fpsTsStart
        fpsCount++

        if(1000 <= fpsTsDiff) {
          this.fps = fpsCount
          fpsTsStart = Date.now()
          fpsCount = 0
        }

        requestAnimationFrame(renderWork)
      }
      renderWork()
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
