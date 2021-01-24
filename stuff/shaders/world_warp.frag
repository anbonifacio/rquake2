#version 450
#extension GL_ARB_separate_shader_objects : enable

// Underwater screen warp effect similar to what software renderer provides.
// Pixel size to simulate lower screen resolutions is used to restore world to full screen size.

layout(push_constant) uniform PushConstant
{
	layout(offset = 68) float time;
	layout(offset = 72) float scale;
	layout(offset = 76) float scrWidth;
	layout(offset = 80) float scrHeight;
	layout(offset = 84) float offsetX;
	layout(offset = 88) float offsetY;
	layout(offset = 92) float pixelSize;
} pc;

layout(set = 0, binding = 0) uniform sampler2D sTexture;

layout(location = 0) out vec4 fragmentColor;

#define PI 3.1415

void main()
{
	vec2 scrSize = vec2(pc.scrWidth, pc.scrHeight);
	vec2 uv = (gl_FragCoord.xy - vec2(pc.offsetX, pc.offsetY)) / scrSize;

	if (pc.time > 0)
	{
		float sx = pc.scale - abs(pc.scrWidth  / 2.0 - gl_FragCoord.x) * 2.0 / pc.scrWidth;
		float sy = pc.scale - abs(pc.scrHeight / 2.0 - gl_FragCoord.y) * 2.0 / pc.scrHeight;
		float xShift = 2.0 * pc.time + uv.y * PI * 10;
		float yShift = 2.0 * pc.time + uv.x * PI * 10;
		vec2 distortion = vec2(sin(xShift) * sx, sin(yShift) * sy) * 0.00666;

		uv += distortion;
	}

	uv /= pc.pixelSize;

	uv = clamp(uv * scrSize, vec2(0.0, 0.0), scrSize - vec2(0.5, 0.5));

	fragmentColor = texture(sTexture, uv);
}
