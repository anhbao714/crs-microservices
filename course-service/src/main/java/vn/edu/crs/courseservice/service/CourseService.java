package vn.edu.crs.courseservice.service;

import org.springframework.stereotype.Service;
import vn.edu.crs.courseservice.dto.CourseRequest;
import vn.edu.crs.courseservice.dto.CourseResponse;
import vn.edu.crs.courseservice.entity.Course;
import vn.edu.crs.courseservice.repository.CourseRepository;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<CourseResponse> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay mon hoc id = " + id));
        return toResponse(course);
    }

    public CourseResponse createCourse(CourseRequest request) {
        if (courseRepository.existsByTenMonHocIgnoreCase(request.getTenMonHoc())) {
            throw new IllegalArgumentException("Ten mon hoc da ton tai");
        }

        Course course = new Course();
        course.setTenMonHoc(request.getTenMonHoc());
        course.setSoTinChi(request.getSoTinChi());
        course.setSoChoToiDa(request.getSoChoToiDa());
        // Quy tac nghiep vu: khi tao moi, so cho con lai luon bang so cho toi da
        course.setSoChoConLai(request.getSoChoToiDa());

        return toResponse(courseRepository.save(course));
    }

    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Khong tim thay mon hoc id = " + id));

        course.setTenMonHoc(request.getTenMonHoc());
        course.setSoTinChi(request.getSoTinChi());
        course.setSoChoToiDa(request.getSoChoToiDa());
        // Khong cho sua truc tiep soChoConLai qua API update thong thuong

        return toResponse(courseRepository.save(course));
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new NoSuchElementException("Khong tim thay mon hoc id = " + id);
        }
        courseRepository.deleteById(id);
    }

    private CourseResponse toResponse(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getTenMonHoc(),
                course.getSoTinChi(),
                course.getSoChoToiDa(),
                course.getSoChoConLai()
        );
    }
}
