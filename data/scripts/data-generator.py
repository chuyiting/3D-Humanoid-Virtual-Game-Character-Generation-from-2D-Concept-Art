import bpy
import math
import glob
import os
from os import listdir

fbxFileDir = "/Users/eddychu/Desktop/FYP/Project/data/fbx/"
outputDir = "/Users/eddychu/Desktop/FYP/Project/data/Img/"


def main():
    fbxTemplate = "*.fbx"
    fbxPaths = glob.glob(fbxFileDir + fbxTemplate)

    # 8 angles
    cameraDist = 6
    cameraDiagDist = ((cameraDist * cameraDist) / 2) ** (0.5)
    cameraPositions = [(cameraDist, 0, 1.3),
                       (0, -cameraDist, 1.3), (0, cameraDist, 1.3)]
    cameraRotations = [(90, 0, 90), (90, 0, 0), (90, 0, 180)]
    cameraIndicators = ["side", "front", "back"]

    poses = ['REST']
    poseIndicators = ['t-shape']

    clear_scene()

    setup_render()
    set_bg_color((1, 1, 1, 1))  # rgba

    # generate image model by model
    for path in fbxPaths:
        modelName = os.path.basename(path)[:-4]
        fbxObj = import_fbx(path)

        for posId, pose in enumerate(poses):
            fbxObj.data.pose_position = pose

            for camId, camPos in enumerate(cameraPositions):
                add_camera(camPos, cameraRotations[camId])

                # with spotlight
                add_light()
                render_img(
                    outputDir, modelName, poseIndicators[posId], 'withlight', cameraIndicators[camId])

                # without spotlight
                remove_light()
                render_img(
                    outputDir, modelName, poseIndicators[posId], 'nolight', cameraIndicators[camId])
#
                remove_camera()
        clear_scene()


#import fbx
def import_fbx(path):
    # height restriction
    height = 2.0
    bpy.ops.import_scene.fbx(filepath=path, automatic_bone_orientation=True)
    bpy.ops.object.select_by_type(type='ARMATURE')
    objDim = bpy.context.object.dimensions
    origYDim = bpy.context.object.dimensions[1]
    scale = height / origYDim
    bpy.context.object.dimensions = bpy.context.object.dimensions * scale
    bpy.context.object.data.pose_position = 'POSE'
    return bpy.context.object


def remove_fbx():
    bpy.ops.object.select_all(action='DESELECT')
    bpy.ops.object.select_by_type(type='ARMATURE')
    bpy.ops.object.delete()

# add camera


def add_camera(camera_pos, camera_rot_deg):
    # input
    camera_rot = tuple(math.pi/180 * deg for deg in camera_rot_deg)

    # create obj
    camera_data = bpy.data.cameras.new(name='Camera')
    camera_object = bpy.data.objects.new('Camera', camera_data)
    bpy.context.scene.collection.objects.link(camera_object)
    bpy.context.view_layer.objects.active = camera_object
    bpy.context.scene.camera = camera_object

    # set attributes
    camera_object.location = camera_pos
    camera_object.rotation_mode = 'XYZ'  # change rotation mode to euler
    camera_object.rotation_euler = camera_rot


def remove_camera():
    bpy.ops.object.select_all(action='DESELECT')
    bpy.ops.object.select_by_type(type='CAMERA')
    bpy.ops.object.delete()


def setup_render():
    # local settings
    _img_resolution_x = 1080
    _img_resolution_y = 1080

    # change resolution, aspect ratio
    bpy.context.scene.render.resolution_x = _img_resolution_x
    bpy.context.scene.render.resolution_y = _img_resolution_y


# add light
def add_light():
    # type POINT, SPOTLIGHT, SUN...
    light_name = "spotLight"
    light_pos = (0.0, -5.0, 5.0)
    light_rot = (45.0 * math.pi / 180.0, 1.0, 0.0, 0.0)  # in radian
    light_scale = (1.0, 1.0, 1.0)
    light_energy = 500
    light_data = bpy.data.lights.new(name=light_name, type='SPOT')
    light_data.energy = 500

    light_object = bpy.data.objects.new(
        name=light_name, object_data=light_data)
    light_object.rotation_mode = 'AXIS_ANGLE'
    light_object.rotation_axis_angle = light_rot
    light_object.location = light_pos
    bpy.context.collection.objects.link(light_object)
    bpy.context.view_layer.objects.active = light_object
    light_object.location = light_pos


def remove_light():
    bpy.ops.object.select_all(action='DESELECT')
    bpy.ops.object.select_by_type(type='LIGHT')
    bpy.ops.object.delete()

# change background colod


def set_bg_color(bg_color):
    bpy.data.worlds["World.001"].node_tree.nodes["Background"].inputs[0].default_value = (
        1, 1, 1, 1)


def clear_scene():
    bpy.ops.object.delete({"selected_objects": bpy.context.scene.objects})


def render_img(output_dir, model_name, pose_indicator, light_indicator, camera_indicator):
    output_file_pattern = "%s_%s_%s_%s.jpg"
    bpy.context.scene.render.filepath = os.path.join(output_dir, (output_file_pattern % (
        model_name, pose_indicator, light_indicator, camera_indicator)))
    bpy.ops.render.render(write_still=True)


main()


class MocapPanel(bpy.types.Panel):
    """Creates a Panel in the Object properties window"""
    bl_label = "Display Data"
    bl_idname = "OBJECT_PT_hello"
    bl_space_type = 'PROPERTIES'
    bl_region_type = 'WINDOW'
    bl_context = "object"

    @classmethod
    def poll(cls, context):
        return context.object is not None

    def draw(self, context):
        layout = self.layout

        obj = context.object
        pos = obj.matrix_world.to_translation()

        row = layout.row()
        row.label(text="Active object is: " + obj.name)
        row = layout.row()
        row.label(text="object position z is %.2f" % pos.z)


def prop_redraw(scene):
    for area in bpy.context.screen.areas:
        if area.type == 'PROPERTIES':
            if area.spaces.active.context == 'OBJECT':
                area.tag_redraw()


def register():
    # clear handlers for testing
    bpy.app.handlers.frame_change_pre.clear()
    # add a handler to make the area "live" without mouse over
    bpy.app.handlers.frame_change_pre.append(prop_redraw)

    bpy.utils.register_class(MocapPanel)
