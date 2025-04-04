import {
  AttributeType,
  gl,
  IAnimateOption,
  IEncodeFeature,
  ILayerConfig,
  IModel,
  IModelUniform,
} from '@antv/l7-core';

import BaseModel from '../../core/BaseModel';
import { ILineLayerStyleOptions, lineStyleType } from '../../core/interface';
import { LineArcTriangulation } from '../../core/triangulation';
import line_arc_frag from '../shaders/line_arc_frag.glsl';
import line_arc2d_vert from '../shaders/line_arc_great_circle_vert.glsl';
const lineStyleObj: { [key: string]: number } = {
  solid: 0.0,
  dash: 1.0,
};

export default class GreatCircleModel extends BaseModel {
  public getUninforms(): IModelUniform {
    const {
      opacity,
      lineType = 'solid',
      dashArray = [10, 5],
    } = this.layer.getLayerConfig() as Partial<ILineLayerStyleOptions>;
    return {
      u_opacity: opacity || 1,
      segmentNumber: 30,
      u_line_type: lineStyleObj[lineType as string] || 0.0,
      u_dash_array: dashArray,
    };
  }
  public getAnimateUniforms(): IModelUniform {
    const { animateOption } = this.layer.getLayerConfig() as ILayerConfig;
    return {
      u_aimate: this.animateOption2Array(animateOption as IAnimateOption),
      u_time: this.layer.getLayerAnimateTime(),
    };
  }

  public buildModels(): IModel[] {
    return [
      this.layer.buildLayerModel({
        moduleName: 'arc2dline',
        vertexShader: line_arc2d_vert,
        fragmentShader: line_arc_frag,
        triangulation: LineArcTriangulation,
        depth: { enable: false },
        blend: this.getBlend(),
      }),
    ];
  }
  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size = 1 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'instance', // 弧线起始点信息
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Instance',
        buffer: {
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 4,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          return [vertex[3], vertex[4], vertex[5], vertex[6]];
        },
      },
    });
  }
}
