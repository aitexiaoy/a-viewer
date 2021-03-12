<template>
    <div class="a-view">
        <div class="from">
            <div class="lable">
                <span>屏幕方向：</span>
                <el-radio :label="1" v-model="viewer">横屏</el-radio>
                <el-radio :label="2" v-model="viewer">竖屏</el-radio>
            </div>

            <div class="lable">
                <span>动画尺寸：</span>
                <el-input size="mini" class="input" v-model="size.width">
                    <template slot="suffix">px</template>
                </el-input>
                <span>&nbsp x &nbsp</span>
                <el-input size="mini" class="input" v-model="size.height">
                    <template slot="suffix">px</template>
                </el-input>
            </div>

            <div class="lable">
                <span>背景颜色：</span>
                <el-color-picker
                    size="mini"
                    class="viewer-color-picker"
                    v-model="color"
                    show-alpha></el-color-picker>
            </div>

            <div class="lable" v-if="animationShow === true">
                <el-upload
                    action=""
                    :multiple="false"
                    :show-file-list="false"
                    :before-upload="handleBeforeUpload">
                    <el-button size="small" type="primary">变更动画</el-button>
                </el-upload>
            </div>
        </div>
        <div class="lable">
            <span>文件信息：</span>
            <span>{{file.name}}</span>
            &nbsp&nbsp
            <span>{{fileSize}}</span>
        </div>

        <div :class="['viewer-box', { 'is-mobile': viewer === 2 }]">
            <div class="viewer-screen" :style="{ backgroundColor: color }">
                <div
                    class="viewer"
                    id="demoCanvas"
                    ref="viewer"
                    :style="{
                        width:`${size.width}px`,
                        height:`${size.height}px`
                    }"></div>
            </div>

            <el-upload
                v-if="animationShow === false"
                class="viewer-upload"
                drag
                action=""
                :multiple="false"
                :show-file-list="false"
                :before-upload="handleBeforeUpload">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                </div>
            </el-upload>
        </div>
    </div>
</template>

<script>
class Player {
    constructor(file, container) {
        this.data = '';
        this.container = container;
        this.player = null;
    }
    load() {}
    init() {}
    create() {}
    destroy() {}
    changeSize() {}
}

class SvgaPlayer extends Player {
    constructor(file, container) {
        super(file, container);
        this.init(file);
    }

    load(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = evt => {
                this.data = evt.target.result;
                resolve(this.data);
            };
            reader.readAsDataURL(file);
        });
    }

    init(file) {
        this.load(file).then(() => {
            this.create();
        });
    }

    create() {
        this.player = new SVGA.Player(this.container);
        const parser = new SVGA.Parser(); // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
        parser.load(this.data, (videoItem) => {
            this.player.setVideoItem(videoItem);
            this.player.startAnimation();
        });
    }

    destroy() {
        if (this.player) {
            this.player.stopAnimation();
            this.container.children.forEach(element => {
                element.remove()
            });
        }
    }

    changeSize() {
        this.destroy();
        this.create();
    }
}

class LottiePlayer extends Player {
    constructor(file, container) {
        super(file, container);
        this.data = {};
        this.init(file);
    }

    load(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = evt => {
                this.data = JSON.parse(evt.target.result);
                resolve(this.data);
            };
            reader.readAsText(file);
        });
    }

    init(file) {
        this.load(file).then(() => {
            this.create();
        });
    }

    create() {
        this.player = lottie.loadAnimation({
            container: this.container,
            renderer: 'canvas',
            loop: true,
            autoplay: true,
            animationData: this.data,
        });
    }

    destroy() {
        if (this.player) {
            this.player.stop();
            this.player.destroy();
        }
    }

    changeSize() {
        this.destroy();
        this.create();
    }
}

export default {
    name: 'Aview',
    data() {
        return {
            color: '#ffffff',
            fromShow: false,
            viewer: 1,
            $player: null,
            size: {
                width: 200,
                height: 200,
            },
            animationShow: false,
            file: {

            }
        };
    },
    mounted() {},
    computed: {
        fileSize: function () {
            if (this.file.size) {
                return  Math.ceil((this.file.size / 1024)) + 'kb'
            }
            return ''
        }
    },
    methods: {
        handleBeforeUpload(file) {
            const { name } = file
            const dom = this.$refs.viewer

            this.file.name = file.name

            this.$set(this.file, 'size', file.size)

            if (this.$player) {
                this.$player.destroy();
                this.animationShow = false;
            }
            if (name.match(/.svga/)) {
                window.player = this.$player = new SvgaPlayer(file, dom)
                this.animationShow = true;
            }

            if (name.match(/.json/)) {
                window.player = this.$player = new LottiePlayer(file, dom)
                this.animationShow = true;
            }
            return false
        }
    },
}
</script>

<style scoped>
.viewer-box {
    padding: 12px 0;
    width: 100%;
    height: calc(100vh - 250px);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-top: 24px;
    border: 1px dashed #ccc;
}

.viewer-screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.is-mobile {
    background: #333;
}

.is-mobile>.viewer-screen {
    width: 375px;
    height: 100%;
    top: 0px;
}

.viewer-upload {
    position: absolute;
    width: 100%;
    height: 100%;
}

.input {
    width: 100px;
}

.from {
    display: flex;
    height: 40px;
}

.lable {
    margin-right: 12px;
    display: flex;
    align-items: center;
}

.lable::after {
    content: "";
    display: block;
    height: 50%;
    border-left: 1px solid #ccc;
    margin-left: 12px;
}
</style>

<style>
.el-radio {
    margin-right: 12px;
}

.el-input__suffix {
    line-height: 28px;
}

.el-upload {
    width: 100%;
    height: 100%;
}

.el-upload-dragger {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: transparent;
}

.el-upload-dragger .el-icon-upload {
    margin-top: 0px;
}
</style>
