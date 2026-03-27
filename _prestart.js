ig.ENTITY.WaveSlidingBlock = ig.ENTITY.WavePushPullBlock.extend({
    init(x_, y_, z_, settings) {
        this.parent(x_, y_, z_, settings);
        this.pushPullable = null
    },
    //look, maybe I just have no idea what I'm doing. If your reading this, and you see the stupidity of this entire kludge, ask me on discord (@quietype00) why I did all this. There's an explenation. Not a *good* explanation, but still.
    show(noShowFx)/*: void*/ {
        ig.game.showEntity(this)
        if (this.effects.hideHandle) {
            this.effects.hideHandle.stop()
            this.effects.hideHandle = null
        }
        if (!noShowFx) {
            this.animState.alpha = 0
            ig.game.effects.teleport.spawnOnTarget('showQuick', this)
        }
        },
    onHideRequest() {
        this.effects.hideHandle = ig.game.effects.teleport.spawnOnTarget('hideQuick', this, {
            align: ig.ENTITY_ALIGN.CENTER,
            callback: this,
        })
    },
    update()/*: void*/ {
        this.updateAnim()
        this.coll.update()
    },
    deferredUpdate: null,
    onInteraction: null,
    onInteractionEnd: null,
    onKill(levelChange/*?: boolean*/)/*: void*/ {
        if (!ig.ENTITY_KILL_CALL) throw Error('Called Entity .onKill() outside of ig.game.kill()')
        ig.ENTITY_KILL_CALL--
        this._killed = true
        this.coll._killed = true
    },
    resetPos: null,
    ballHit(ballLike/*: ig.BallLike*/)/*: boolean*/ {
        if (this.phased) return false
        if (true) {
            if (ballLike.getElement() != sc.ELEMENT.WAVE || !((ballLike.isBall && ballLike.attackInfo.hasHint('CHARGED')) || ballLike instanceof sc.CompressedWaveEntity))
                return false
            this.phased = true
            ballLike.addEntityAttached(this)
            this.setCurrentAnim('phasing')
            return false
        }
    },
    onMagnetStart() {
        if (!this.magnet) return false
        this.magnet = true
        this.coll.setType(ig.COLLTYPE.NPBLOCK)
        return true
    },
    onMagnetEnd(b) {
        this.magnet = false
        b && this.effects.sheet.spawnOnTarget('boxThud', this)
    },

})